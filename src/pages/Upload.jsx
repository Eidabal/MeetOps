import { useState, useRef } from "react";
import { C, DEMO_TRANSCRIPT } from "../lib/constants";
import { ANALYSIS_STEPS } from "../features/analysis/pipeline";
import { Topbar } from "../components/layout/Topbar";
import { Btn } from "../components/ui/Btn";
import { useAnalysis } from "../hooks/useAnalysis";

export function PageUpload({ setPage, setMeetingResult }) {
  // État UI local (toute la mécanique d'analyse vit dans useAnalysis)
  const [fileInfo, setFileInfo] = useState(null);   // {name, source, transcript}
  const [customTx, setCustomTx] = useState("");       // transcription collée
  const [inputTab, setInputTab] = useState("demo");   // demo | paste | file
  const [drag,     setDrag]     = useState(false);
  const inputRef = useRef();

  const { phase, currentStep, doneSteps, log, stream, tokens, logRef, pct, start } =
    useAnalysis({ onResult: setMeetingResult });

  const startWithTranscript = (info) => { setFileInfo(info); start(info.transcript); };

  const handleFile = (file) => {
    if (!file) return;
    const isTxt = file.type === "text/plain" || file.name.endsWith(".txt") || file.name.endsWith(".vtt");
    if (isTxt) {
      const reader = new FileReader();
      reader.onload = e => startWithTranscript({ name: file.name, source: "file", transcript: e.target.result });
      reader.readAsText(file);
    } else {
      // Audio/vidéo : transcription de démo (Whisper nécessite un serveur)
      startWithTranscript({ name: file.name, source: "file", transcript: DEMO_TRANSCRIPT });
    }
  };

  // ── DROP SCREEN ───────────────────────────────────────────────
  if (phase === "drop") return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <Topbar title="Analyser une réunion">
        <Btn onClick={()=>setPage("dashboard")}>← Retour</Btn>
      </Topbar>
      <div style={{flex:1,overflowY:"auto",padding:"32px 24px"}}>
        <div style={{maxWidth:600,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:28}}>
            <div style={{display:"inline-flex",alignItems:"center",gap:7,background:"rgba(99,102,241,0.12)",border:`1px solid ${C.accentL}`,borderRadius:20,padding:"5px 14px",fontSize:11,color:C.accent,fontWeight:600,marginBottom:14}}>
              <i className="ti ti-sparkles" style={{fontSize:12}}/>Analyse 100% live · Claude Sonnet 4
            </div>
            <h2 style={{fontSize:26,fontWeight:800,color:C.text1,letterSpacing:-0.6,marginBottom:8}}>Importez votre réunion</h2>
            <p style={{fontSize:14,color:C.text2,lineHeight:1.6}}>L'IA analyse votre transcription en temps réel et génère un CR structuré complet.</p>
          </div>

          {/* Input tabs */}
          <div style={{display:"flex",background:C.bg3,borderRadius:9,padding:3,marginBottom:18}}>
            {[["demo","✦ Démo rapide"],["paste","Coller ma transcription"],["file","Uploader un fichier"]].map(([id,label])=>(
              <button key={id} onClick={()=>setInputTab(id)}
                style={{flex:1,padding:"8px 0",borderRadius:7,fontSize:12,fontWeight:500,border:"none",cursor:"pointer",
                  background:inputTab===id?C.bg4:"transparent",color:inputTab===id?C.text1:C.text3,transition:"all .15s"}}>
                {label}
              </button>
            ))}
          </div>

          {/* Demo tab */}
          {inputTab==="demo" && (
            <div style={{background:C.bg3,border:`1px solid ${C.border2}`,borderRadius:12,padding:"20px 22px",marginBottom:16}}>
              <div style={{display:"flex",gap:14,alignItems:"flex-start",marginBottom:16}}>
                <div style={{width:44,height:44,borderRadius:10,background:C.accentL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>☁️</div>
                <div>
                  <div style={{fontSize:14,fontWeight:600,color:C.text1,marginBottom:3}}>Migration Azure — Arbitrage Infra</div>
                  <div style={{fontSize:12,color:C.text3}}>25 mai 2026 · 14h00–15h30 · 6 participants · Teams</div>
                  <div style={{marginTop:8,display:"flex",gap:6,flexWrap:"wrap"}}>
                    {[["accent","3 décisions"],["teal","5 actions"],["red","2 risques"],["amber","4 questions"]].map(([cl,lb])=>(
                      <span key={lb} style={{fontSize:10,padding:"2px 8px",borderRadius:4,fontWeight:600,background:C[cl+"L"],color:C[cl]}}>{lb}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{background:C.bg4,borderRadius:8,padding:"10px 14px",marginBottom:16,fontFamily:"monospace",fontSize:11,color:C.text2,lineHeight:1.6,maxHeight:120,overflowY:"auto"}}>
                {DEMO_TRANSCRIPT.split("\n").slice(0,8).map((l,i)=><div key={i} style={{color:l.startsWith("[")?C.teal:C.text2}}>{l}</div>)}
                <div style={{color:C.text3,marginTop:4}}>… {DEMO_TRANSCRIPT.split("\n").length} lignes</div>
              </div>
              <button onClick={()=>startWithTranscript({name:"Migration Azure — Arbitrage Infra", source:"demo", transcript:DEMO_TRANSCRIPT})}
                style={{width:"100%",background:"linear-gradient(135deg,#6366F1,#A78BFA)",color:"white",border:"none",borderRadius:9,
                  padding:"12px 0",fontSize:14,fontWeight:700,cursor:"pointer",boxShadow:"0 4px 20px rgba(99,102,241,0.4)"}}>
                <i className="ti ti-sparkles" style={{fontSize:14}}/> Lancer l'analyse live
              </button>
              <div style={{marginTop:8,fontSize:11,color:C.text3,textAlign:"center"}}>
                Analyse réelle par Claude Sonnet 4 · ~15-30 secondes
              </div>
            </div>
          )}

          {/* Paste tab */}
          {inputTab==="paste" && (
            <div style={{marginBottom:16}}>
              <textarea value={customTx} onChange={e=>setCustomTx(e.target.value)}
                placeholder={"Collez votre transcription ici…\n\nEx :\n[14:02] Marie : On valide la migration Azure.\n[14:05] Kevin : Le mapping SAP doit être fait avant le 30 mai.\n…"}
                style={{width:"100%",height:200,background:C.bg3,border:`1px solid ${C.border2}`,borderRadius:10,
                  padding:"12px 14px",fontSize:12,color:C.text1,fontFamily:"monospace",lineHeight:1.6,
                  resize:"vertical",outline:"none",boxSizing:"border-box",marginBottom:10}}/>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{fontSize:11,color:C.text3}}>{customTx.length} caractères</span>
                <button onClick={()=>{if(customTx.trim().length>40) startWithTranscript({name:"Réunion analysée",source:"paste",transcript:customTx});}}
                  disabled={customTx.trim().length<40}
                  style={{background:customTx.trim().length>=40?"linear-gradient(135deg,#6366F1,#A78BFA)":C.bg4,
                    color:customTx.trim().length>=40?"white":C.text3,border:"none",borderRadius:8,
                    padding:"9px 22px",fontSize:13,fontWeight:600,cursor:customTx.trim().length>=40?"pointer":"not-allowed"}}>
                  Analyser ↗
                </button>
              </div>
            </div>
          )}

          {/* File tab */}
          {inputTab==="file" && (
            <div>
              <div onDragOver={e=>{e.preventDefault();setDrag(true)}} onDragLeave={()=>setDrag(false)}
                onDrop={e=>{e.preventDefault();setDrag(false);handleFile(e.dataTransfer.files[0]);}}
                onClick={()=>inputRef.current.click()}
                style={{border:`2px dashed ${drag?C.accent:C.border2}`,borderRadius:12,padding:"44px 24px",
                  textAlign:"center",cursor:"pointer",background:drag?C.accentL:C.bg3,transition:"all .2s",marginBottom:12}}>
                <input ref={inputRef} type="file" style={{display:"none"}}
                  accept=".txt,.vtt,.mp4,.mp3,.wav,.m4a,.docx" onChange={e=>handleFile(e.target.files[0])}/>
                <div style={{fontSize:36,marginBottom:12,opacity:drag?1:0.55}}>{drag?"📂":"🎙️"}</div>
                <div style={{fontSize:14,fontWeight:600,color:C.text1,marginBottom:6}}>
                  {drag?"Relâchez pour importer":"Déposez votre fichier ici"}
                </div>
                <div style={{fontSize:12,color:C.text3}}>TXT, VTT (analysés live) · MP4, MP3 (transcription démo)</div>
              </div>
              <div style={{background:C.amberL,border:`1px solid ${C.amber}33`,borderRadius:8,padding:"10px 14px",fontSize:12,color:C.amber}}>
                <i className="ti ti-info-circle" style={{fontSize:13,marginRight:6}}/>
                Les fichiers .txt et .vtt sont analysés avec votre contenu réel. Audio/vidéo utilisent la transcription de démo (Whisper nécessite un serveur).
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );


  // ── ANALYSIS + STREAMING UI ───────────────────────────────────
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <Topbar title={phase==="done"?"Analyse terminée ✓ · Claude Sonnet 4":phase==="streaming"?"Génération du CR en cours…":"Analyse en cours…"}>
        <div style={{fontSize:12,color:C.text3,display:"flex",alignItems:"center",gap:6}}><i className="ti ti-sparkles" style={{fontSize:13,color:C.accent}}/>Claude Sonnet 4 · Live</div>
        {phase==="done"&&<Btn onClick={()=>setPage("cr")} primary><i className="ti ti-file-description" style={{fontSize:14}}/>Voir le CR</Btn>}
      </Topbar>
      <div style={{flex:1,overflowY:"auto",padding:"20px 22px"}}>
        <div style={{maxWidth:900,margin:"0 auto"}}>
          <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 18px",marginBottom:16,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:36,height:36,borderRadius:8,background:C.accentL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{fileInfo?.source==="paste"?"📝":fileInfo?.source==="file"?"📄":"☁️"}</div>
              <div>
                <div style={{fontSize:13,fontWeight:600,color:C.text1}}>{fileInfo?.name||"Transcription"}</div>
                <div style={{fontSize:11,color:C.text3,display:"flex",alignItems:"center",gap:8,marginTop:2}}>
                  <span style={{display:"inline-flex",alignItems:"center",gap:4,background:C.accentL,color:C.accent,padding:"2px 8px",borderRadius:4,fontSize:10,fontWeight:600}}><i className="ti ti-sparkles" style={{fontSize:10}}/>Claude Sonnet 4 · Live</span>
                  <span>{fileInfo?.transcript?.length?.toLocaleString()||0} caractères</span>
                </div>
              </div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:10,color:C.text3,textTransform:"uppercase",letterSpacing:.5}}>Tokens traités</div>
              <div style={{fontSize:20,fontWeight:800,color:C.accent,fontVariantNumeric:"tabular-nums",letterSpacing:-0.5}}>{tokens.toLocaleString()}</div>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,padding:"16px 18px"}}>
              <div style={{fontSize:11,color:C.text3,textTransform:"uppercase",letterSpacing:0.6,fontWeight:600,marginBottom:12}}>Pipeline d'analyse</div>
              <div style={{height:4,background:C.bg4,borderRadius:2,marginBottom:16,overflow:"hidden"}}>
                <div style={{height:"100%",width:phase==="streaming"||phase==="done"?"100%":pct+"%",background:"linear-gradient(90deg,#6366F1,#A78BFA)",borderRadius:2,transition:"width .5s ease"}}/>
              </div>
              {ANALYSIS_STEPS.map((step,i)=>{
                const isDone=doneSteps.includes(step.id), isRun=currentStep===i&&phase==="analyzing";
                return (
                  <div key={step.id} style={{display:"flex",alignItems:"center",gap:11,padding:"8px 0",borderBottom:i<ANALYSIS_STEPS.length-1?`1px solid ${C.border}`:"none"}}>
                    <div style={{width:30,height:30,borderRadius:8,flexShrink:0,background:isDone?`${step.color}22`:isRun?`${step.color}14`:C.bg3,border:`1px solid ${isDone?step.color+"44":isRun?step.color+"22":C.border}`,display:"flex",alignItems:"center",justifyContent:"center",transition:"all .3s"}}>
                      <i className={`ti ti-${isDone?"check":step.icon}`} style={{fontSize:13,color:isDone?step.color:isRun?step.color:C.text3}}/>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontSize:13,fontWeight:isDone||isRun?500:400,color:isDone?C.text1:isRun?step.color:C.text3,transition:"color .3s"}}>{step.label}</div>
                      {isRun&&<div style={{fontSize:10,color:step.color,animation:"blink 1s infinite"}}>En cours…</div>}
                      {isDone&&<div style={{fontSize:10,color:C.text3}}>Terminé</div>}
                    </div>
                    {isDone&&<i className="ti ti-check-circle" style={{fontSize:14,color:step.color}}/>}
                    {isRun&&<div style={{width:14,height:14,borderRadius:"50%",border:`2px solid ${step.color}`,borderTopColor:"transparent",animation:"spin .7s linear infinite"}}/>}
                    {!isDone&&!isRun&&<div style={{width:5,height:5,borderRadius:"50%",background:C.bg4}}/>}
                  </div>
                );
              })}
              {(phase==="streaming"||phase==="done")&&(
                <div style={{display:"flex",alignItems:"center",gap:11,padding:"8px 0",marginTop:4,borderTop:`1px solid ${C.border}`}}>
                  <div style={{width:30,height:30,borderRadius:8,flexShrink:0,background:phase==="done"?C.greenL:C.accentL,border:`1px solid ${phase==="done"?C.green+"44":C.accent+"44"}`,display:"flex",alignItems:"center",justifyContent:"center"}}>
                    <i className={`ti ti-${phase==="done"?"sparkles":"brain"}`} style={{fontSize:13,color:phase==="done"?C.green:C.accent}}/>
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontSize:13,fontWeight:500,color:phase==="done"?C.green:C.accent}}>{phase==="done"?"CR généré par Claude ✓":"Génération live en cours…"}</div>
                    <div style={{fontSize:10,color:C.text3}}>{phase==="done"?"Prêt à consulter":"Claude Sonnet 4 · streaming SSE"}</div>
                  </div>
                  {phase==="done"?<i className="ti ti-check-circle" style={{fontSize:14,color:C.green}}/>:<div style={{width:14,height:14,borderRadius:"50%",border:`2px solid ${C.accent}`,borderTopColor:"transparent",animation:"spin .7s linear infinite"}}/>}
                </div>
              )}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:12}}>
              <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
                <div style={{padding:"8px 12px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",gap:5}}>{[C.red,C.amber,C.green].map(cl=><div key={cl} style={{width:8,height:8,borderRadius:"50%",background:cl}}/>)}</div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <span style={{fontSize:10,color:C.text3,fontFamily:"monospace"}}>meetcopilot.pipeline</span>
                    {phase==="analyzing"&&<span style={{fontSize:9,fontWeight:700,color:C.accent,background:C.accentL,padding:"1px 6px",borderRadius:3}}>LIVE</span>}
                  </div>
                </div>
                <div ref={logRef} style={{height:150,overflowY:"auto",padding:"8px 12px",fontFamily:"monospace",fontSize:10,color:C.text2,lineHeight:1.7}}>
                  {log.length===0&&<span style={{color:C.text3}}>Démarrage du pipeline…</span>}
                  {log.map((line,i)=>{const col=line.startsWith("→")?C.accent:line.includes("✓")?C.green:line.startsWith("✗")?C.red:C.text2;return <div key={i} style={{color:col}}><span style={{color:C.text3}}>[log]</span> {line}</div>;})}
                </div>
              </div>
              <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden",flex:1}}>
                <div style={{padding:"8px 12px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:7}}><i className="ti ti-sparkles" style={{fontSize:12,color:C.accent}}/><span style={{fontSize:12,fontWeight:600,color:C.text2}}>Sortie Claude live</span></div>
                  {phase==="streaming"&&<div style={{display:"flex",alignItems:"center",gap:6}}><div style={{width:6,height:6,borderRadius:"50%",background:C.green,animation:"blink 1s infinite"}}/><span style={{fontSize:9,color:C.green,fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>STREAMING</span></div>}
                  {phase==="done"&&<span style={{fontSize:9,color:C.teal,fontWeight:700}}>COMPLET ✓</span>}
                </div>
                <div style={{height:210,overflowY:"auto",padding:"8px 12px",fontFamily:"monospace",fontSize:10,lineHeight:1.6,whiteSpace:"pre-wrap",wordBreak:"break-all"}}>
                  {(phase==="analyzing")&&<span style={{color:C.text3}}>En attente de la fin du pipeline…</span>}
                  {(phase==="streaming"||phase==="done")&&(<>{stream.split("\n").map((line,i)=>{const isKey=/"[^"]+"\s*:/.test(line);const isStr=/:\s*"[^"]*"/.test(line)&&!isKey;const isNum=/:\s*\d/.test(line);return <div key={i} style={{color:isKey?C.teal:isStr?C.accent:isNum?C.amber:C.text2}}>{line}</div>;})} {phase==="streaming"&&<span style={{animation:"blink 1s infinite",color:C.accent,fontWeight:700}}>▋</span>}</>)}
                </div>
              </div>
            </div>
          </div>
          {phase==="done"&&(
            <div style={{marginTop:14,background:C.greenL,border:`1px solid ${C.green}33`,borderRadius:10,padding:"18px 22px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{display:"flex",alignItems:"center",gap:14}}>
                <div style={{width:42,height:42,borderRadius:10,background:C.greenL,border:`1px solid ${C.green}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>✓</div>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:C.text1}}>Analyse terminée · CR sauvegardé</div>
                  <div style={{fontSize:12,color:C.text3,marginTop:2}}>
                    {tokens.toLocaleString()} tokens · Réunion ajoutée à votre liste · Accessible depuis Meetings
                  </div>
                </div>
              </div>
              <div style={{display:"flex",gap:8}}>
                <Btn onClick={()=>setPage("meetings")}>
                  <i className="ti ti-calendar-event" style={{fontSize:14}}/>Voir dans Meetings
                </Btn>
                <Btn primary onClick={()=>setPage("cr")}>
                  <i className="ti ti-file-description" style={{fontSize:14}}/>Ouvrir le CR
                </Btn>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
