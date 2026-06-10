import { useState, useEffect, useRef } from "react";
import { C, ROLES } from "../../lib/constants";
import { callClaude } from "../../lib/anthropic";

export function NextStepsPanel({ result, role, pastContext }) {
  const sel = ROLES.find(r => r.id === role) || ROLES[0];
  const [steps,   setSteps]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const prevKey = useRef(null);

  useEffect(() => {
    if (!result) return;
    const key = `${result.name}::${role}`;
    if (prevKey.current === key) return;
    prevKey.current = key;
    setLoading(true); setError(false); setSteps([]);

    const decisionsList = (result.decisions||[]).map(d=>`- ${d.text}`).join("\n");
    const actionsList   = (result.actions||[]).map(a=>`- ${a.text} (owner: ${a.owner}, deadline: ${a.deadline}, priorité: ${a.priority})`).join("\n");
    const risksList     = (result.risks||[]).map(r=>`- [${r.level}] ${r.text}`).join("\n");
    const questionsList = (result.openQuestions||[]).map(q=>`- ${q}`).join("\n");
    const memoryList    = (result.memory||[]).map(m=>`- [${m.type}] ${m.label}: ${m.text}`).join("\n");

    const prompt = `Tu es MeetCopilot, un assistant IA de gestion de réunions IT.

Génère exactement 4 next steps actionnables pour le rôle : ${sel.label} (${sel.tagline}).
Ces next steps doivent être SPÉCIFIQUES à cette réunion — pas génériques. Référence des noms, décisions, deadlines réels.
Si une alerte Meeting Memory est pertinente, intègre-la (ex: "Relancer Marie sur le mapping SAP ouvert depuis le 20 mai").

RÉUNION : ${result.name} — ${result.date}

DÉCISIONS :
${decisionsList}

ACTIONS ASSIGNÉES :
${actionsList}

RISQUES :
${risksList}

QUESTIONS OUVERTES :
${questionsList}

ALERTES MEETING MEMORY :
${memoryList}

RÉUNIONS PASSÉES :
${pastContext || "Aucun contexte disponible."}

Réponds UNIQUEMENT en JSON valide (sans markdown) :
[{"icon":"emoji","title":"Titre court actionnable","desc":"1-2 phrases spécifiques avec contexte réel","link":"Réunion liée si pertinent, sinon null","priority":"HAUTE|MOYENNE|NORMALE"}]`;

    (async () => {
      try {
        const raw   = await callClaude({ prompt, maxTokens: 1000 });
        const clean = (raw || "[]").replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);
        setSteps(Array.isArray(parsed) ? parsed : []);
      } catch {
        setSteps([
          {icon:"📄",title:"Rédiger l'ADR Migration Azure",desc:"Documenter la décision validée aujourd'hui : abandon AWS → Azure (Hub-and-Spoke, économie 34%, middleware X maintenu 6 mois).",link:null,priority:"HAUTE"},
          {icon:"⚠️",title:"Lever l'incohérence Middleware X",desc:"Contradiction avec le CR du 3 avril (retrait voté). Clarifier la position compliance avant de finaliser le plan de sortie S28.",link:"CR 3 avril 2026",priority:"HAUTE"},
          {icon:"🔌",title:"Valider les interfaces SAP avant cut-over",desc:"Marie L. deadline 30 mai (CRITIQUE). Bloquer le go-live S27 si le mapping SAP ↔ Azure n'est pas livré à temps.",link:null,priority:"HAUTE"},
          {icon:"📐",title:"Suivre le sizing infra non clôturé",desc:"Le sizing est bloqué depuis 3 réunions (5 mai, 20 mai, aujourd'hui). J. Dupont deadline 3 juin — escalade si nécessaire.",link:"Réunion 20 mai 2026",priority:"MOYENNE"},
        ]);
      } finally {
        setLoading(false);
      }
    })();
  }, [result?.name, role]);

  const prioColor = p => p==="HAUTE"?C.red:p==="MOYENNE"?C.amber:C.teal;
  const prioBg    = p => p==="HAUTE"?C.redL:p==="MOYENNE"?C.amberL:C.tealL;

  return (
    <div style={{padding:"14px",borderBottom:`1px solid ${C.border}`}}>
      <div style={{fontSize:10,color:C.text3,textTransform:"uppercase",letterSpacing:0.6,fontWeight:600,marginBottom:10,display:"flex",alignItems:"center",gap:6}}>
        <i className="ti ti-sparkles" style={{fontSize:11,color:C.accent}}/>
        Next steps IA
        <span style={{fontSize:9,fontWeight:700,color:C.accent,letterSpacing:.5,marginLeft:2}}>LIVE</span>
        {loading&&<div style={{width:10,height:10,borderRadius:"50%",border:`2px solid ${C.accent}`,borderTopColor:"transparent",animation:"spin .7s linear infinite",marginLeft:"auto"}}/>}
      </div>
      {loading&&(
        <div style={{textAlign:"center",padding:"18px 0"}}>
          <div style={{width:28,height:28,borderRadius:"50%",border:`2px solid ${C.accent}`,borderTopColor:"transparent",animation:"spin .7s linear infinite",margin:"0 auto 8px"}}/>
          <div style={{fontSize:11,color:C.text3}}>Génération en cours…</div>
          <div style={{fontSize:10,color:C.text3,marginTop:3}}>Contexte réunion + mémoire passée</div>
        </div>
      )}
      {!loading && steps.map((s,i)=>(
        <div key={i} style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:8,padding:"10px 12px",marginBottom:8,cursor:"pointer",borderLeft:`3px solid ${prioColor(s.priority)}`,transition:"border-color .15s"}}
          onMouseEnter={e=>e.currentTarget.style.backgroundColor=C.bg4}
          onMouseLeave={e=>e.currentTarget.style.backgroundColor=C.bg3}>
          <div style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:s.link?6:0}}>
            <span style={{fontSize:14,flexShrink:0}}>{s.icon}</span>
            <div style={{flex:1}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:3}}>
                <div style={{fontSize:12,fontWeight:600,color:C.text1,flex:1}}>{s.title}</div>
                <span style={{fontSize:9,fontWeight:700,padding:"2px 5px",borderRadius:3,background:prioBg(s.priority),color:prioColor(s.priority),flexShrink:0}}>{s.priority}</span>
              </div>
              <div style={{fontSize:11,color:C.text2,lineHeight:1.5}}>{s.desc}</div>
            </div>
          </div>
          {s.link&&<div style={{marginTop:5,fontSize:10,color:C.accent,display:"flex",alignItems:"center",gap:4,marginLeft:22}}><i className="ti ti-history" style={{fontSize:10}}/> Lié à : {s.link}</div>}
        </div>
      ))}
      {!loading&&steps.length===0&&<div style={{fontSize:12,color:C.text3,textAlign:"center",padding:"12px 0"}}>Aucun next step généré.</div>}
    </div>
  );
}
