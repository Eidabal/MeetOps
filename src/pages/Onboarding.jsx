import { useState, useEffect } from "react";
import { C, ROLES } from "../lib/constants";
import { Particles } from "../components/ui/Particles";
import { Btn } from "../components/ui/Btn";

export function Onboarding({onDone}) {
  const [step,setStep] = useState(0);
  const [role,setRole] = useState(null);
  const [hovered,setHovered] = useState(null);
  const [prefs,setPrefs] = useState({lang:"Français",summary:true,memory:true,nextSteps:true,alerts:true,integrations:[]});
  const [count,setCount] = useState(0);
  const sel = ROLES.find(r=>r.id===role) || ROLES[0];

  useEffect(()=>{
    if(step!==3)return;
    let f=0; const t=setInterval(()=>{f++;setCount(Math.min(f,60));if(f>=60)clearInterval(t);},18);
    return()=>clearInterval(t);
  },[step]);

  const updatePref=(k,v)=>setPrefs(p=>({...p,[k]:v}));
  const lerp=n=>Math.round((count/60)*n);

  const Toggle=({label,desc,field})=>(
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"13px 0",borderBottom:`1px solid ${C.border}`}}>
      <div>
        <div style={{fontSize:13,fontWeight:500,color:C.text1,marginBottom:2}}>{label}</div>
        <div style={{fontSize:11,color:C.text3}}>{desc}</div>
      </div>
      <div onClick={()=>updatePref(field,!prefs[field])}
        style={{width:40,height:22,borderRadius:11,cursor:"pointer",
          background:prefs[field]?sel?.color||C.accent:C.bg4,
          border:`1px solid ${prefs[field]?sel?.color+"55"||C.accent+"55":C.border2}`,
          position:"relative",transition:"all .25s",flexShrink:0}}>
        <div style={{position:"absolute",top:3,left:prefs[field]?19:3,width:14,height:14,
          borderRadius:"50%",background:"white",transition:"left .25s"}}/>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",background:C.bg,position:"relative",overflow:"hidden",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      padding:"32px 20px",fontFamily:"'Syne',system-ui,sans-serif"}}>
      <Particles/>
      <div style={{position:"fixed",top:-200,left:"50%",transform:"translateX(-50%)",
        width:500,height:350,borderRadius:"50%",
        background:"radial-gradient(ellipse,rgba(99,102,241,0.1) 0%,transparent 70%)",pointerEvents:"none"}}/>

      <div style={{width:"100%",maxWidth:step===1?740:560,
        background:"rgba(15,17,26,0.9)",backdropFilter:"blur(20px)",
        border:`1px solid ${C.border2}`,borderRadius:18,
        padding:"36px 38px 32px",
        boxShadow:"0 24px 80px rgba(0,0,0,0.5)",
        transition:"max-width .3s ease",position:"relative",zIndex:1}}>

        {/* Step dots */}
        {step>0&&(
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:0,marginBottom:36}}>
            {["Bienvenue","Rôle","Préférences","Prêt"].map((label,i)=>(
              <div key={label} style={{display:"flex",alignItems:"center"}}>
                <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:5}}>
                  <div style={{width:30,height:30,borderRadius:"50%",
                    background:i<step?C.accent:i===step?"transparent":C.bg4,
                    border:i===step?`2px solid ${C.accent}`:i<step?"none":`2px solid ${C.border2}`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontSize:i<step?13:12,fontWeight:700,
                    color:i<step?"white":i===step?C.accent:C.text3,
                    boxShadow:i===step?`0 0 0 4px ${C.accent}22`:"none",transition:"all .3s"}}>
                    {i<step?"✓":i+1}
                  </div>
                  <span style={{fontSize:9,color:i===step?C.accent:i<step?C.text2:C.text3,
                    fontWeight:i===step?600:400,whiteSpace:"nowrap"}}>{label}</span>
                </div>
                {i<3&&<div style={{width:52,height:1,background:i<step?C.accent:C.border2,margin:"0 5px",marginBottom:18,transition:"background .4s"}}/>}
              </div>
            ))}
          </div>
        )}

        {/* Step 0: Welcome */}
        {step===0&&(
          <div style={{textAlign:"center"}}>
            <div style={{width:68,height:68,borderRadius:18,margin:"0 auto 24px",
              background:"linear-gradient(135deg,#6366F1,#A78BFA)",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:30,
              boxShadow:"0 8px 36px rgba(99,102,241,0.4)"}}>🧠</div>
            <div style={{fontSize:11,color:C.accent,textTransform:"uppercase",letterSpacing:2,fontWeight:700,marginBottom:10}}>MeetCopilot · AI Meeting OS</div>
            <h1 style={{fontSize:32,fontWeight:800,color:C.text1,letterSpacing:-0.8,lineHeight:1.15,marginBottom:14}}>
              Bienvenue dans votre<br/>
              <span style={{background:"linear-gradient(90deg,#6366F1,#A78BFA)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Meeting OS</span>
            </h1>
            <p style={{fontSize:14,color:C.text2,lineHeight:1.7,marginBottom:32,maxWidth:380,margin:"0 auto 32px"}}>
              L'IA qui transforme vos réunions en décisions actionnables — comptes rendus, actions, risques, mémoire contextuelle.
            </p>
            <div style={{display:"flex",flexWrap:"wrap",gap:9,justifyContent:"center",marginBottom:36}}>
              {[["✦","Analyse IA en temps réel"],["🔍","Meeting Memory"],["🎯","Vue par rôle"],["📤","Export Jira & Teams"]].map(([ic,lb])=>(
                <div key={lb} style={{display:"flex",alignItems:"center",gap:7,background:C.bg3,
                  border:`1px solid ${C.border2}`,borderRadius:20,padding:"6px 14px",fontSize:12,color:C.text2}}>
                  <span>{ic}</span>{lb}
                </div>
              ))}
            </div>
            <button onClick={()=>setStep(1)} style={{background:"linear-gradient(135deg,#6366F1,#A78BFA)",
              color:"white",border:"none",borderRadius:10,padding:"13px 38px",fontSize:14,fontWeight:700,
              cursor:"pointer",boxShadow:"0 6px 28px rgba(99,102,241,0.45)"}}>
              Commencer la configuration →
            </button>
            <div style={{marginTop:12,fontSize:11,color:C.text3}}>2 minutes · Modifiable à tout moment</div>
          </div>
        )}

        {/* Step 1: Role */}
        {step===1&&(
          <div>
            <div style={{textAlign:"center",marginBottom:28}}>
              <h2 style={{fontSize:24,fontWeight:800,color:C.text1,letterSpacing:-0.5,marginBottom:7}}>Quel est votre rôle ?</h2>
              <p style={{fontSize:13,color:C.text2}}>L'IA adapte chaque CR à votre perspective.</p>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:20}}>
              {ROLES.map(r=>{
                const isSel=role===r.id, isHov=hovered===r.id;
                return (
                  <div key={r.id} onClick={()=>setRole(r.id)}
                    onMouseEnter={()=>setHovered(r.id)} onMouseLeave={()=>setHovered(null)}
                    style={{background:isSel?`${r.color}15`:isHov?C.bg3:C.bg2,
                      border:`1.5px solid ${isSel?r.color+"55":isHov?C.border2:C.border}`,
                      borderRadius:11,padding:"15px 13px",cursor:"pointer",transition:"all .18s",
                      position:"relative",boxShadow:isSel?`0 0 0 3px ${r.color}18`:"none"}}>
                    {isSel&&<div style={{position:"absolute",top:9,right:9,width:18,height:18,borderRadius:"50%",
                      background:r.color,display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:10,color:"white",fontWeight:700}}>✓</div>}
                    <div style={{fontSize:26,marginBottom:8}}>{r.icon}</div>
                    <div style={{fontSize:13,fontWeight:700,color:isSel?r.color:C.text1,marginBottom:3}}>{r.label}</div>
                    <div style={{fontSize:11,color:C.text3,lineHeight:1.3}}>{r.tagline}</div>
                  </div>
                );
              })}
            </div>
            {sel&&(
              <div style={{background:C.bg3,border:`1px solid ${C.border2}`,borderRadius:9,padding:"14px 18px",marginBottom:20}}>
                <div style={{display:"flex",gap:20}}>
                  <div>
                    <div style={{fontSize:10,color:C.text3,textTransform:"uppercase",letterSpacing:0.5,fontWeight:600,marginBottom:7}}>Focus IA</div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
                      {(sel?.focus||[]).map(f=><span key={f} style={{fontSize:11,padding:"3px 8px",borderRadius:5,background:`${sel.color}18`,color:sel.color,border:`1px solid ${sel.color}28`,fontWeight:500}}>{f}</span>)}
                    </div>
                  </div>
                  <div style={{width:1,background:C.border,flexShrink:0}}/>
                  <div>
                    <div style={{fontSize:10,color:C.text3,textTransform:"uppercase",letterSpacing:0.5,fontWeight:600,marginBottom:7}}>Next steps suggérés</div>
                    {(sel?.nextSteps||[]).map(n=><div key={n} style={{fontSize:12,color:C.text2,marginBottom:4,display:"flex",gap:6}}><span style={{color:sel.color}}>→</span>{n}</div>)}
                  </div>
                </div>
              </div>
            )}
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <Btn onClick={()=>setStep(0)}>← Retour</Btn>
              <Btn primary onClick={()=>setStep(2)} style={{opacity:role?1:0.5,cursor:role?"pointer":"not-allowed"}}>Continuer →</Btn>
            </div>
          </div>
        )}

        {/* Step 2: Prefs */}
        {step===2&&(
          <div>
            <div style={{textAlign:"center",marginBottom:28}}>
              <h2 style={{fontSize:24,fontWeight:800,color:C.text1,letterSpacing:-0.5,marginBottom:7}}>Personnalisez votre expérience</h2>
              <p style={{fontSize:13,color:C.text2}}>Tout est modifiable dans les paramètres.</p>
            </div>
            <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:10,padding:"4px 18px",marginBottom:12}}>
              <Toggle label="Résumé exécutif automatique" desc="Générer un résumé en 3 phrases après chaque analyse" field="summary"/>
              <Toggle label="Meeting Memory activée" desc="Détecter les liens avec les réunions précédentes" field="memory"/>
              <Toggle label="Next steps IA" desc="Suggestions contextualisées à votre rôle" field="nextSteps"/>
              <Toggle label="Alertes incohérences" desc="Notifier si une décision contredit un CR antérieur" field="alerts"/>
            </div>
            <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 18px",marginBottom:22}}>
              <div style={{fontSize:10,color:C.text3,textTransform:"uppercase",letterSpacing:0.5,fontWeight:600,marginBottom:10}}>Intégrations</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {[["Jira","🔵"],["Microsoft Teams","💜"],["ServiceNow","🟢"],["Slack","⚫"]].map(([e,ic])=>{
                  const active=(prefs.integrations||[]).includes(e);
                  return (
                    <div key={e} onClick={()=>{const cur=prefs.integrations||[];updatePref("integrations",active?cur.filter(x=>x!==e):[...cur,e]);}}
                      style={{display:"flex",alignItems:"center",gap:9,padding:"9px 12px",borderRadius:7,cursor:"pointer",
                        border:`1px solid ${active?sel?.color+"44"||C.accent+"44":C.border}`,
                        background:active?`${sel?.color||C.accent}10`:C.bg4,transition:"all .15s"}}>
                      <span>{ic}</span>
                      <span style={{fontSize:13,color:active?sel?.color||C.accent:C.text2,fontWeight:active?600:400}}>{e}</span>
                      {active&&<span style={{marginLeft:"auto",fontSize:12,color:sel?.color||C.accent}}>✓</span>}
                    </div>
                  );
                })}
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <Btn onClick={()=>setStep(1)}>← Retour</Btn>
              <Btn primary onClick={()=>setStep(3)}>Finaliser →</Btn>
            </div>
          </div>
        )}

        {/* Step 3: Ready */}
        {step===3&&(
          <div style={{textAlign:"center"}}>
            <div style={{position:"relative",display:"inline-flex",marginBottom:24}}>
              <div style={{width:80,height:80,borderRadius:"50%",
                background:sel?sel?.grad||"linear-gradient(135deg,#6366F1,#A78BFA)":"linear-gradient(135deg,#6366F1,#A78BFA)",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:34,
                boxShadow:`0 0 0 10px ${sel?.color||C.accent}12, 0 8px 36px ${sel?.color||C.accent}36`}}>
                {sel?.icon||"✦"}
              </div>
              <div style={{position:"absolute",bottom:-3,right:-3,width:26,height:26,borderRadius:"50%",
                background:C.green,display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:13,color:"white",fontWeight:700,border:`3px solid ${C.bg}`}}>✓</div>
            </div>
            <h2 style={{fontSize:26,fontWeight:800,color:C.text1,letterSpacing:-0.5,marginBottom:8}}>Vous êtes prêt·e !</h2>
            <p style={{fontSize:13,color:C.text2,lineHeight:1.6,marginBottom:28}}>MeetCopilot est configuré. Votre première analyse vous attend.</p>
            <div style={{display:"flex",gap:10,marginBottom:24}}>
              {[[lerp(24),"Réunions/mois",sel?.color||C.accent],[lerp(147),"Min éco./réunion",C.teal],[lerp(98)+"%","Satisfaction",C.green]].map(([n,l,c])=>(
                <div key={l} style={{flex:1,background:C.bg3,border:`1px solid ${C.border}`,borderRadius:9,padding:"13px 10px"}}>
                  <div style={{fontSize:24,fontWeight:800,color:c,marginBottom:3,fontVariantNumeric:"tabular-nums"}}>{n}</div>
                  <div style={{fontSize:10,color:C.text3,lineHeight:1.4}}>{l}</div>
                </div>
              ))}
            </div>
            <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:10,padding:"12px 16px",marginBottom:24,textAlign:"left"}}>
              {[
                [true,`Rôle : ${sel?.label}`],[true,`Meeting Memory : ${prefs.memory?"activée":"désactivée"}`],
                [true,`Next steps IA : ${prefs.nextSteps?"activés":"désactivés"}`],
                [(prefs.integrations||[]).length>0,`Intégrations : ${(prefs.integrations||[]).join(", ")||"aucune"}`],
              ].map(([ok,text])=>(
                <div key={text} style={{display:"flex",alignItems:"center",gap:9,padding:"5px 0",fontSize:12,color:ok?C.text1:C.text3}}>
                  <span style={{color:ok?C.green:C.text3}}>{ok?"✓":"○"}</span>{text}
                </div>
              ))}
            </div>
            <button onClick={()=>onDone(role,prefs)}
              style={{width:"100%",background:sel?sel?.grad||"linear-gradient(135deg,#6366F1,#A78BFA)":"linear-gradient(135deg,#6366F1,#A78BFA)",
                color:"white",border:"none",borderRadius:10,padding:"14px 0",
                fontSize:15,fontWeight:800,cursor:"pointer",
                boxShadow:`0 6px 28px ${sel?.color||C.accent}45`}}>
              Accéder à mon Dashboard →
            </button>
          </div>
        )}
      </div>
      <div style={{marginTop:18,fontSize:11,color:C.text3,display:"flex",gap:18,position:"relative",zIndex:1}}>
        {["Confidentialité","CGU","Support"].map(l=><span key={l} style={{cursor:"pointer"}}>{l}</span>)}
      </div>
    </div>
  );
}
