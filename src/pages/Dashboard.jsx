import { C, ROLES, DEMO_RESULT } from "../lib/constants";
import { pColor, pBg } from "../lib/format";
import { Badge } from "../components/ui/Badge";
import { Btn } from "../components/ui/Btn";
import { Topbar } from "../components/layout/Topbar";
import { MEMORY_LINKS } from "../features/memory/memoryLinks";

export function PageDashboard({setPage,role,meetingsList=[],setActiveCR}) {
  const sel = ROLES.find(r=>r.id===role)||ROLES[0];

  // Réunions récentes : vraies analysées en tête + statiques en complément
  const staticMeetings = [
    {icon:"☁️",color:C.accentL,icolor:C.accent,name:"Migration Azure — Arbitrage infra",time:"25 mai · 14h",users:6,decisions:3,actions:5,risks:2,result:DEMO_RESULT},
    {icon:"🔗",color:C.tealL,  icolor:C.teal,  name:"Design review — API Gateway v2",  time:"24 mai · 10h",users:4,decisions:1,questions:3,result:null},
    {icon:"🔒",color:C.amberL, icolor:C.amber, name:"IAM & compliance — Audit Q2",     time:"22 mai",      users:8,risks:4,actions:7,result:null},
  ];
  const liveMeetings = meetingsList.slice(0,3).map(m=>({
    icon:"✦",color:C.accentL,icolor:C.accent,
    name:m.name, time:m.date, users:null,
    decisions:m.decisions, actions:m.actions, risks:m.risks, questions:m.questions,
    result:m.result, isNew:true,
  }));
  const meetings = [...liveMeetings, ...staticMeetings].slice(0,3);

  const handleMeetingClick = (m) => {
    setActiveCR(m.result || DEMO_RESULT);
    setPage("cr");
  };
  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <Topbar title="Dashboard">
        <Btn onClick={()=>setPage("upload")}><i className="ti ti-upload" style={{fontSize:14}}/>Importer</Btn>
        <Btn primary onClick={()=>setPage("upload")}><i className="ti ti-sparkles" style={{fontSize:14}}/>Analyser</Btn>
      </Topbar>
      <div style={{flex:1,overflowY:"auto",padding:22}}>
        {/* Stats */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
          {[[24,C.accent,"Réunions analysées","↑ 4 ce mois"],[13,C.teal,"Actions en cours","5 en retard"],[7,C.red,"Risques détectés","2 critiques"],[9,C.amber,"Questions ouvertes","non tranchées"]].map(([n,color,label,sub])=>(
            <div key={label} style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 16px"}}>
              <div style={{fontSize:10,color:C.text3,textTransform:"uppercase",letterSpacing:0.5,marginBottom:6}}>{label}</div>
              <div style={{fontSize:26,fontWeight:800,color,marginBottom:3,letterSpacing:-1}}>{n}</div>
              <div style={{fontSize:11,color:C.text3}}>{sub}</div>
            </div>
          ))}
        </div>

        <div style={{display:"grid",gridTemplateColumns:"3fr 2fr",gap:14,marginBottom:14}}>
          {/* Recent meetings */}
          <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
            <div style={{padding:"12px 16px",borderBottom:`1px solid ${C.border}`,
              display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <span style={{fontSize:13,fontWeight:600}}>Réunions récentes</span>
              <span style={{fontSize:11,color:C.accent,cursor:"pointer"}} onClick={()=>setPage("meetings")}>Voir tout →</span>
            </div>
            {meetings.map((m,i)=>(
              <div key={i} onClick={()=>handleMeetingClick(m)}
                style={{display:"flex",gap:12,padding:"12px 16px",
                  borderBottom:i<meetings.length-1?`1px solid ${C.border}`:"none",
                  cursor:"pointer",transition:"background .15s",
                  background:m.isNew?`${C.accent}06`:"transparent"}}
                onMouseEnter={e=>e.currentTarget.style.background=C.bg3}
                onMouseLeave={e=>e.currentTarget.style.background=m.isNew?`${C.accent}06`:"transparent"}>
                <div style={{width:36,height:36,borderRadius:8,background:m.color,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:m.isNew?14:17,flexShrink:0,
                  border:m.isNew?`1px solid ${C.accent}44`:"none"}}>
                  {m.isNew?<i className="ti ti-sparkles" style={{fontSize:14,color:C.accent}}/>:m.icon}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:m.isNew?600:500,marginBottom:3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{m.name}</div>
                  <div style={{fontSize:11,color:C.text3,display:"flex",gap:10,marginBottom:5}}>
                    <span>⏱ {m.time}</span>{m.users&&<span>👥 {m.users}</span>}
                    {m.isNew&&<span style={{color:C.accent,fontWeight:600}}>✦ Analysée live</span>}
                  </div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                    {m.decisions&&<Badge text={`${m.decisions} décisions`} bg={C.accentL} color={C.accent}/>}
                    {m.actions&&<Badge text={`${m.actions} actions`} bg={C.tealL} color={C.teal}/>}
                    {m.risks&&<Badge text={`${m.risks} risques`} bg={C.redL} color={C.red}/>}
                    {m.questions&&<Badge text={`${m.questions} questions`} bg={C.amberL} color={C.amber}/>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right column */}
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {/* Risks */}
            <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
              <div style={{padding:"10px 14px",borderBottom:`1px solid ${C.border}`,fontSize:13,fontWeight:600}}>Risques actifs</div>
              {[["Dépendance fournisseur AWS","Migration Azure","ÉLEVÉ"],["Dette technique middleware X","IAM Audit","ÉLEVÉ"],["Équipe indisponible S22","API Gateway","MOYEN"]].map(([t,src,lvl])=>(
                <div key={t} style={{padding:"10px 14px",borderBottom:`1px solid ${C.border}`,display:"flex",gap:10,alignItems:"flex-start"}}>
                  <div style={{width:7,height:7,borderRadius:"50%",background:lvl==="ÉLEVÉ"?C.red:C.amber,flexShrink:0,marginTop:5}}/>
                  <div style={{flex:1}}>
                    <div style={{fontSize:12,fontWeight:500,marginBottom:2}}>{t}</div>
                    <div style={{fontSize:10,color:C.text3}}>{src}</div>
                  </div>
                  <Badge text={lvl} bg={pBg(lvl)} color={pColor(lvl)}/>
                </div>
              ))}
            </div>
            {/* Meeting Memory — branché sur MEMORY_LINKS */}
            <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
              <div style={{padding:"10px 14px",borderBottom:`1px solid ${C.border}`,
                display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <div style={{fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:7}}>
                  Meeting Memory
                  <span style={{width:7,height:7,borderRadius:"50%",background:C.green,display:"inline-block"}}/>
                </div>
                <span onClick={()=>setPage("memory")}
                  style={{fontSize:11,color:C.accent,cursor:"pointer",fontWeight:500}}>
                  Voir tout →
                </span>
              </div>
              {MEMORY_LINKS.slice(0,3).map((link,i)=>{
                const typeColor = t => t==="inconsistency"?C.red:t==="recurring"?C.amber:t==="open"?C.teal:C.accent;
                const typeBgL   = t => t==="inconsistency"?C.redL:t==="recurring"?C.amberL:t==="open"?C.tealL:C.accentL;
                const typeIconL = t => t==="inconsistency"?"⚡":t==="recurring"?"🔁":t==="open"?"📌":"🔗";
                const typeLblL  = t => t==="inconsistency"?"Incohérence":t==="recurring"?"Récurrent":t==="open"?"Action liée":"Contexte";
                return (
                  <div key={i} onClick={()=>setPage("memory")}
                    style={{padding:"9px 14px",borderBottom:i<2?`1px solid ${C.border}`:"none",
                      display:"flex",gap:8,alignItems:"flex-start",cursor:"pointer",transition:"background .15s"}}
                    onMouseEnter={e=>e.currentTarget.style.background=C.bg3}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <span style={{fontSize:11,fontWeight:700,padding:"2px 7px",borderRadius:4,whiteSpace:"nowrap",flexShrink:0,
                      background:typeBgL(link.type),color:typeColor(link.type)}}>
                      {typeIconL(link.type)} {typeLblL(link.type)}
                    </span>
                    <span style={{fontSize:11,color:C.text2,lineHeight:1.4}}>{link.text}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions + next steps */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
            <div style={{padding:"10px 16px",borderBottom:`1px solid ${C.border}`,fontSize:13,fontWeight:600}}>Actions — vue {sel.label}</div>
            {DEMO_RESULT.actions.slice(0,4).map((a,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 16px",
                borderBottom:i<3?`1px solid ${C.border}`:"none"}}>
                <div style={{width:16,height:16,borderRadius:4,border:`1px solid ${C.border2}`,
                  background:i===0?C.green:C.bg3,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                  {i===0&&<i className="ti ti-check" style={{fontSize:10,color:"#0E1A10"}}/>}
                </div>
                <span style={{flex:1,fontSize:13,color:i===0?C.text3:C.text1,
                  textDecoration:i===0?"line-through":"none"}}>{a.text}</span>
                <span style={{fontSize:11,background:C.bg3,border:`1px solid ${C.border}`,
                  padding:"2px 7px",borderRadius:4,color:C.text2}}>{a.owner}</span>
                <Badge text={a.priority} bg={pBg(a.priority)} color={pColor(a.priority)}/>
              </div>
            ))}
          </div>
          <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
            <div style={{padding:"10px 16px",borderBottom:`1px solid ${C.border}`,
              display:"flex",alignItems:"center",gap:6,fontSize:13,fontWeight:600}}>
              <i className="ti ti-sparkles" style={{fontSize:14,color:C.accent}}/>
              Next steps — {sel.label}
              <span style={{fontSize:9,fontWeight:700,color:C.accent,textTransform:"uppercase",letterSpacing:0.5,marginLeft:2}}>AI</span>
            </div>
            {(sel?.nextSteps||[]).map((n,i)=>(
              <div key={i} style={{padding:"11px 16px",borderBottom:i<sel.nextSteps.length-1?`1px solid ${C.border}`:"none"}}>
                <div style={{fontSize:13,fontWeight:500,color:C.text1,marginBottom:3}}>{n}</div>
                <div style={{fontSize:11,color:C.text3}}>Recommandé après analyse →</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
