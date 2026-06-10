import { useState, useEffect, useRef, useCallback } from "react";
import { ANALYSIS_STEPS, STEP_LOGS } from "../features/analysis/pipeline";
import { buildAnalysisPrompt } from "../features/analysis/prompts";
import { parseAnalysisResult } from "../features/analysis/parser";
import { streamClaude } from "../lib/anthropic";
import { PAST_MEETINGS_CONTEXT, DEMO_TRANSCRIPT, DEMO_RESULT } from "../lib/constants";

// Moteur d'analyse : pipeline simulé + streaming Claude + parsing.
// phases : drop | analyzing | streaming | done
export function useAnalysis({ onResult }) {
  const [phase,       setPhase]       = useState("drop");
  const [currentStep, setCurrentStep] = useState(0);
  const [doneSteps,   setDoneSteps]   = useState([]);
  const [log,         setLog]         = useState([]);
  const [stream,      setStream]      = useState("");
  const [tokens,      setTokens]      = useState(0);
  const [transcript,  setTranscript]  = useState(null);

  const logRef   = useRef();
  const abortRef = useRef(null);

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  const addLog = useCallback((line) => setLog(l => [...l.slice(-50), line]), []);

  // Lance le pipeline simulé, puis bascule en phase "streaming".
  const start = useCallback((tx) => {
    setTranscript(tx || DEMO_TRANSCRIPT);
    setPhase("analyzing");
    setCurrentStep(0); setDoneSteps([]); setLog([]); setStream(""); setTokens(0);

    let stepIndex = 0;
    const steps = ANALYSIS_STEPS;
    const advanceStep = () => {
      if (stepIndex >= steps.length) return;
      const step = steps[stepIndex];
      setCurrentStep(stepIndex);
      const logs = STEP_LOGS[step.id] || [];
      logs.forEach((line, i) => setTimeout(() => addLog(line), i * 220));
      setTimeout(() => {
        setDoneSteps(d => [...d, step.id]);
        stepIndex++;
        if (stepIndex < steps.length) setTimeout(advanceStep, 300 + Math.random() * 200);
        else setPhase("streaming");
      }, logs.length * 220 + 200);
    };
    setTimeout(advanceStep, 400);
  }, [addLog]);

  // Appel streamé réel, déclenché quand le pipeline atteint "streaming".
  useEffect(() => {
    if (phase !== "streaming") return;
    addLog("→ Connexion à l'API Anthropic…");

    const tx = transcript || DEMO_TRANSCRIPT;
    let cancelled = false;
    let buffer = "";
    let inputT = 0;
    abortRef.current = { cancel: () => { cancelled = true; } };

    (async () => {
      try {
        addLog("→ Envoi de la transcription au modèle…");
        await streamClaude({
          prompt: buildAnalysisPrompt(tx, PAST_MEETINGS_CONTEXT),
          maxTokens: 2000,
          isCancelled: () => cancelled,
          onOpen: () => addLog("→ Streaming ouvert ✓"),
          onText: (text) => { buffer += text; setStream(buffer); setTokens(t => t + 1); },
          onInputTokens: (it) => { inputT = it; setTokens(it); },
          onOutputTokens: (ot) => setTokens(inputT + ot),
        });

        if (cancelled) return;
        addLog("→ Génération terminée ✓");

        const parsed = parseAnalysisResult(buffer);
        if (parsed) {
          addLog("→ CR structuré parsé ✓");
          setTimeout(() => { setPhase("done"); onResult(parsed); }, 500);
        } else {
          addLog("→ Fallback CR de démonstration");
          setTimeout(() => { setPhase("done"); onResult({ ...DEMO_RESULT, _live: false }); }, 400);
        }
      } catch (err) {
        if (cancelled) return;
        addLog(`✗ Erreur API : ${err.message}`);
        addLog("→ Utilisation du CR de démonstration…");
        setTimeout(() => { setPhase("done"); onResult({ ...DEMO_RESULT, _live: false }); }, 1000);
      }
    })();

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  const pct = Math.min(100, Math.round(doneSteps.length / ANALYSIS_STEPS.length * 100));

  return { phase, currentStep, doneSteps, log, stream, tokens, logRef, pct, start };
}
