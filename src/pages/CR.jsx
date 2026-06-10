import { useState } from "react";
import { C, ROLES, PAST_MEETINGS_CONTEXT, DEMO_RESULT } from "../lib/constants";
import { pColor, pBg, mColor, mBg, mIcon } from "../lib/format";
import { Badge } from "../components/ui/Badge";
import { Btn } from "../components/ui/Btn";
import { Topbar } from "../components/layout/Topbar";
import { NextStepsPanel } from "../features/nextSteps/NextStepsPanel";

export function PageCR({role,setPage,result}) {
  const sel = ROLES.find(r=>r.id===role)||ROLES[0];
  const res = result || DEMO_RESULT;
  const [activeSection,setActiveSection] = useState("summary");
  const [roleTab,setRoleTab] = useState(role||"architect");

  const sections = [
    {id:"summary",label:"Executive Summary",icon:"file-description"},
    {id:"decisions",label:"Key Decisions",icon:"gavel"},
    {id:"actions",label:"Action Items",icon:"checkbox"},
    {id:"risks",label:"Risks",icon:"alert-triangle"},
    {id:"questions",label:"Open Questions",icon:"question-mark"},
    {id:"systems",label:"Systèmes impactés",icon:"topology-star"},
    {id:"memory",label:"Meeting Memory",icon:"history"},
  ];

  const roleFocus = {
    architect:[["🏗","Valider la topologie Hub-and-Spoke et documenter les flux"],["⚠️","Lever l'ambiguïté sur la dette Middleware X vs compliance"],["🔌","Cartographier les interfaces SAP avant le cut-over"],["📄","Rédiger l'ADR de la décision migration"]],
    pm:[["📅","Replanifier les milestones go-live S27 avec les nouvelles dépendances"],["👤","Clarifier l'ownership des questions ouvertes"],["📋","Créer les items RAID pour le contrat AWS et le middleware"],["🔔","Relancer sur les 2 actions critiques en retard"]],
    security:[["🔒","Vérifier que le modèle IAM Azure AD couvre les exigences compliance"],["📜","Tracer le Middleware X dans le registre des risques compliance"],["🛡","Revalider le RTO/RPO de la stratégie DR sur Azure"],["🔍","Confirmer que l'IAM audit Q2 couvre la nouvelle architecture"]],
  };
  const focusItems = roleFocus[roleTab] || roleFocus.architect;

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <Topbar title="">
        <div style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
          <span style={{fontSize:13,color:C.text3,cursor:"pointer"}} onClick={()=>setPage("meetings")}>Meetings</span>
          <i className="ti ti-chevron-right" style={{fontSize:12,color:C.text3}}/>
          <span style={{fontSize:13,fontWeight:500,color:C.text1}}>Migration Azure — Arbitrage infra</span>
          <Badge text="✦ Analysé par IA" bg={C.accentL} color={C.accent} style={{marginLeft:4}}/>
        </div>
        <Btn onClick={()=>setPage("meetings")}>← Retour</Btn>
        <Btn><i className="ti ti-file-word" style={{fontSize:14,color:"#2B79D4"}}/>Word</Btn>
        <Btn primary><i className="ti ti-check" style={{fontSize:14}}/>CR validé</Btn>
      </Topbar>

      <div style={{flex:1,display:"flex",overflow:"hidden"}}>
        {/* Left nav */}
        <div style={{width:190,minWidth:190,borderRight:`1px solid ${C.border}`,padding:"14px 0",overflowY:"auto"}}>
          <div style={{fontSize:9,color:C.text3,textTransform:"uppercase",letterSpacing:0.7,padding:"0 14px",marginBottom:8,fontWeight:600}}>Sections</div>
          {sections.map(({id,label,icon})=>(
            <div key={id} onClick={()=>setActiveSection(id)}
              style={{padding:"8px 14px",fontSize:12,cursor:"pointer",
                color:activeSection===id?C.accent:C.text2,
                background:activeSection===id?C.accentL:"transparent",
                borderRight:activeSection===id?`2px solid ${C.accent}`:"2px solid transparent",
                fontWeight:activeSection===id?500:400,transition:"all .15s",
                display:"flex",alignItems:"center",gap:8}}>
              <i className={`ti ti-${icon}`} style={{fontSize:13,color:activeSection===id?C.accent:C.text3}}/>
              {label}
            </div>
          ))}
          <div style={{padding:"12px 14px",borderTop:`1px solid ${C.border}`,marginTop:12}}>
            <button onClick={()=>setPage("upload")} style={{width:"100%",background:"linear-gradient(135deg,#6366F1,#A78BFA)",
              color:"white",border:"none",borderRadius:7,padding:"8px 0",fontSize:12,fontWeight:600,cursor:"pointer",marginBottom:7}}>↗ Jira</button>
            <button style={{width:"100%",background:C.bg3,color:C.text2,border:`1px solid ${C.border}`,
              borderRadius:7,padding:"7px 0",fontSize:12,fontWeight:500,cursor:"pointer"}}>↓ Export Word</button>
          </div>
        </div>

        {/* Main content */}
        <div style={{flex:1,overflowY:"auto",padding:"22px 26px"}}>
          {/* Header */}
          <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:12,padding:"18px 22px",marginBottom:20}}>
            <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",marginBottom:14}}>
              <div>
                <div style={{fontSize:20,fontWeight:800,color:C.text1,letterSpacing:-0.5,marginBottom:5}}>{res.name}</div>
                <div style={{fontSize:12,color:C.text3,display:"flex",gap:14}}>
                  <span>📅 {res.date}</span>
                </div>
              </div>
              <Badge text="AI generated" bg={C.accentL} color={C.accent}/>
            </div>
            <div style={{display:"flex",gap:10,paddingTop:14,borderTop:`1px solid ${C.border}`}}>
              {[[res.decisions?.length,"Décisions",C.accent,C.accentL],[res.actions?.length,"Actions",C.teal,C.tealL],[res.risks?.length,"Risques",C.red,C.redL],[res.openQuestions?.length,"Questions",C.amber,C.amberL]].map(([n,l,c,bg])=>(
                <div key={l} style={{flex:1,background:bg,border:`1px solid ${c}22`,borderRadius:8,padding:"10px 0",textAlign:"center"}}>
                  <div style={{fontSize:22,fontWeight:800,color:c}}>{n}</div>
                  <div style={{fontSize:10,color:C.text3,textTransform:"uppercase",letterSpacing:0.4}}>{l}</div>
                </div>
              ))}
            </div>
          </div>

          {activeSection==="summary"&&(
            <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,padding:"18px 22px"}}>
              <div style={{fontSize:14,color:C.text2,lineHeight:1.8}}>{res.summary}</div>
            </div>
          )}
          {activeSection==="decisions"&&(res.decisions||[]).map((d,i)=>(
            <div key={i} style={{display:"flex",gap:14,padding:"14px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{width:26,height:26,borderRadius:6,background:C.accentL,border:`1px solid ${C.accent}33`,
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:C.accent,flexShrink:0}}>{d.id}</div>
              <div>
                <div style={{fontSize:14,fontWeight:600,color:C.text1,marginBottom:4}}>{d.text}</div>
                <div style={{fontSize:12,color:C.text3,lineHeight:1.5}}>{d.context}</div>
              </div>
            </div>
          ))}
          {activeSection==="actions"&&(
            <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 110px 90px 80px",padding:"8px 18px",
                background:C.bg3,fontSize:10,color:C.text3,textTransform:"uppercase",letterSpacing:0.5,fontWeight:600,gap:12}}>
                <span>Action</span><span>Owner</span><span>Deadline</span><span>Priorité</span>
              </div>
              {(res.actions||[]).map((a,i)=>(
                <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 110px 90px 80px",padding:"11px 18px",
                  gap:12,borderTop:`1px solid ${C.border}`,alignItems:"center",
                  background:i%2===0?"transparent":`${C.bg3}88`}}>
                  <span style={{fontSize:13,color:C.text1}}>{a.text}</span>
                  <span style={{fontSize:12,fontWeight:600,color:C.accent}}>{a.owner}</span>
                  <span style={{fontSize:12,color:C.text3}}>{a.deadline}</span>
                  <Badge text={a.priority} bg={pBg(a.priority)} color={pColor(a.priority)}/>
                </div>
              ))}
            </div>
          )}
          {activeSection==="risks"&&(res.risks||[]).map((r,i)=>(
            <div key={i} style={{background:C.redL,border:`1px solid ${C.red}22`,borderRadius:10,
              padding:"14px 18px",marginBottom:12,borderLeft:`3px solid ${C.red}`}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}>
                <Badge text={r.level} bg={C.redL} color={C.red}/>
                <span style={{fontSize:14,fontWeight:600,color:C.text1}}>{r.text}</span>
              </div>
              <div style={{fontSize:12,color:C.text3,lineHeight:1.5}}>{r.detail}</div>
            </div>
          ))}
          {activeSection==="questions"&&(res.openQuestions||[]).map((q,i)=>(
            <div key={i} style={{display:"flex",gap:10,padding:"11px 0",borderBottom:`1px solid ${C.border}`}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:C.amber,flexShrink:0,marginTop:6}}/>
              <div style={{fontSize:13,color:C.text2,lineHeight:1.5}}>{q}</div>
            </div>
          ))}
          {activeSection==="systems"&&(
            <div style={{display:"flex",flexWrap:"wrap",gap:10}}>
              {(res.systems||[]).map((sys,i)=>(
                <div key={i} style={{display:"flex",alignItems:"center",gap:8,
                  background:C.bg3,border:`1px solid ${pColor(sys.impact)}33`,
                  borderRadius:8,padding:"8px 14px"}}>
                  <div style={{width:8,height:8,borderRadius:"50%",background:pColor(sys.impact)}}/>
                  <span style={{fontSize:13,fontWeight:500,color:C.text1}}>{sys.name}</span>
                  <Badge text={sys.impact} bg={pBg(sys.impact)} color={pColor(sys.impact)}/>
                </div>
              ))}
            </div>
          )}
          {activeSection==="memory"&&(res.memory||[]).map((m,i)=>(
            <div key={i} style={{background:mBg(m.type),border:`1px solid ${mColor(m.type)}22`,
              borderRadius:10,padding:"13px 16px",marginBottom:10,borderLeft:`3px solid ${mColor(m.type)}`}}>
              <div style={{fontSize:11,fontWeight:700,color:mColor(m.type),marginBottom:5}}>
                {mIcon(m.type)} {m.label}
              </div>
              <div style={{fontSize:13,color:C.text2,lineHeight:1.5}}>{m.text}</div>
            </div>
          ))}
        </div>

        {/* Right panel */}
        <div style={{width:256,minWidth:256,borderLeft:`1px solid ${C.border}`,overflowY:"auto"}}>
          {/* Role view */}
          <div style={{padding:"14px 14px",borderBottom:`1px solid ${C.border}`}}>
            <div style={{fontSize:10,color:C.text3,textTransform:"uppercase",letterSpacing:0.6,fontWeight:600,marginBottom:10}}>Vue par rôle</div>
            <div style={{display:"flex",background:C.bg3,borderRadius:7,padding:3,marginBottom:12}}>
              {["architect","pm","security"].map(r=>(
                <div key={r} onClick={()=>setRoleTab(r)}
                  style={{flex:1,textAlign:"center",fontSize:10,padding:"5px 0",borderRadius:5,cursor:"pointer",
                    background:roleTab===r?C.bg4:"transparent",color:roleTab===r?C.text1:C.text3,
                    fontWeight:roleTab===r?600:400,transition:"all .15s"}}>
                  {r==="architect"?"Archi":r==="pm"?"PM":"Sécu"}
                </div>
              ))}
            </div>
            {focusItems.map(([icon,text],i)=>(
              <div key={i} style={{display:"flex",gap:8,padding:"7px 0",borderBottom:i<focusItems.length-1?`1px solid ${C.border}`:"none",fontSize:12,color:C.text2,lineHeight:1.4}}>
                <span style={{flexShrink:0}}>{icon}</span><span>{text}</span>
              </div>
            ))}
          </div>
          {/* ✦ AI NEXT STEPS — contextualised */}
          <NextStepsPanel result={res} role={roleTab} pastContext={PAST_MEETINGS_CONTEXT}/>
          {/* Memory alerts */}
          <div style={{padding:"14px"}}>
            <div style={{fontSize:10,color:C.text3,textTransform:"uppercase",letterSpacing:0.6,fontWeight:600,marginBottom:10}}>
              <i className="ti ti-history" style={{fontSize:11,color:C.red}}/> Meeting Memory
            </div>
            {(res.memory||[]).map((m,i)=>(
              <div key={i} style={{background:mBg(m.type),border:`1px solid ${mColor(m.type)}22`,
                borderRadius:8,padding:"9px 10px",marginBottom:7}}>
                <div style={{fontSize:10,fontWeight:700,color:mColor(m.type),marginBottom:3}}>{mIcon(m.type)} {m.label}</div>
                <div style={{fontSize:11,color:C.text2,lineHeight:1.4}}>{m.text}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
