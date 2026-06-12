import { useState, useEffect } from "react";
import { C, ROLES } from "../lib/constants";
import { callClaude } from "../lib/anthropic";
import { Topbar } from "../components/layout/Topbar";
import { MemoryGraph } from "../components/memory/MemoryGraph";
import { MEMORY_MEETINGS, MEMORY_LINKS, MEMORY_AI_PROMPT } from "../features/memory/memoryLinks";

export function PageMemory({ setPage, role }) {
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [filterType,      setFilterType]      = useState("all");
  const [aiReport,        setAiReport]        = useState(null);
  const [aiLoading,       setAiLoading]       = useState(true);
  const [activeTab,       setActiveTab]       = useState("liens");

  const sel = ROLES.find(r => r.id === role) || ROLES[0];

  useEffect(() => {
    let cancelled = false;
    setAiLoading(true);
    callClaude({ prompt: MEMORY_AI_PROMPT, maxTokens: 1200 })
    .then(raw=>{
      if (cancelled) return;
      const clean = (raw||"{}").replace(/```json|```/g,"").trim();
      try { setAiReport(JSON.parse(clean)); }
      catch { const m=clean.match(/\{[\s\S]*\}/); if(m) try{setAiReport(JSON.parse(m[0]));}catch{} }
    })
    .catch(()=>{
      if (!cancelled) setAiReport({
        synthesis:"3 patterns critiques détectés : le Middleware X fait l'objet d'une contradiction entre le retrait voté en avril et son maintien le 25 mai. Kafka reste non résolu depuis 3 réunions. La migration Azure crée des dépendances croisées avec SAP, IAM et l'API Gateway.",
        hotTopics:[
          {topic:"Kafka performance",count:3,meetings:["8 avr","15 avr","20 mai"],risk:"ÉLEVÉ",action:"Créer un chantier dédié avec owner identifié"},
          {topic:"Middleware X compliance",count:2,meetings:["3 avr","22 mai"],risk:"ÉLEVÉ",action:"Clarifier la décision finale avant go-live S27"},
          {topic:"Sizing infra",count:3,meetings:["5 mai","20 mai","25 mai"],risk:"MOYEN",action:"Escalader à J. Dupont — deadline 3 juin critique"},
        ],
        criticalInconsistencies:[
          {title:"Middleware X : retrait voté vs maintenu",detail:"Le 3 avril, retrait voté unanimement pour compliance RGPD. Le 25 mai, décision inversée sans référence à ce vote ni ADR formel.",meetings:["3 avr","25 mai"],recommendation:"Rédiger un ADR, valider avec DSI et RSSI, tracer dans le registre des risques."},
          {title:"Compliance Middleware X : double signalement",detail:"L'audit Q2 du 22 mai soulève à nouveau le risque compliance de Middleware X, alors que son retrait était censé le résoudre.",meetings:["22 mai","3 avr"],recommendation:"Owner désigné pour la résolution compliance avant le go-live S27."},
        ],
        openActionsAtRisk:[
          {action:"Mapping SAP ↔ Azure", owner:"Marie L.", dueDate:"30 mai", blockedBy:"Interfaces non documentées"},
          {action:"Validation IAM Azure AD", owner:"K. Tran", dueDate:"31 mai", blockedBy:"Modèle AD non finalisé"},
          {action:"Investigation Kafka perf", owner:"Équipe Infra", dueDate:"Non définie", blockedBy:"Aucun owner désigné"},
        ],
        sinceLastMeeting:{
          completed:["Étude TCO Azure livrée (Marie L.)","Rapport compliance DSI remis"],
          overdue:["Investigation Kafka (ouverte depuis le 15 avril)","Plan de sortie Middleware X (jamais démarré)"],
          newRisks:["Dépendance contractuelle AWS jusqu'en S30","Contradiction décision Middleware X non documentée"],
        }
      });
    })
    .finally(()=>{ if (!cancelled) setAiLoading(false); });
    return ()=>{ cancelled=true; };
  }, []);

  const filteredLinks   = filterType==="all" ? MEMORY_LINKS : MEMORY_LINKS.filter(l=>l.type===filterType);
  const selMeetingData  = MEMORY_MEETINGS.find(m=>m.id===selectedMeeting);
  const linkedLinks     = selectedMeeting ? MEMORY_LINKS.filter(l=>l.from===selectedMeeting||l.to===selectedMeeting) : filteredLinks;

  const typeColor = t => t==="inconsistency"?C.red:t==="recurring"?C.amber:t==="open"?C.teal:C.accent;
  const typeBg    = t => t==="inconsistency"?C.redL:t==="recurring"?C.amberL:t==="open"?C.tealL:C.accentL;
  const typeIcon  = t => t==="inconsistency"?"⚡":t==="recurring"?"🔁":t==="open"?"📌":"🔗";
  const typeLabel = t => t==="inconsistency"?"Incohérence":t==="recurring"?"Récurrent":t==="open"?"Action liée":"Contexte";
  const prioColor = p => p==="HAUTE"?C.red:p==="MOYENNE"?C.amber:p==="INFO"?C.accent:C.teal;
  const prioBg    = p => p==="HAUTE"?C.redL:p==="MOYENNE"?C.amberL:p==="INFO"?C.accentL:C.tealL;

  const filterChips = [
    ["all","Tous",MEMORY_LINKS.length],
    ["inconsistency","⚡ Incohérences",MEMORY_LINKS.filter(l=>l.type==="inconsistency").length],
    ["recurring","🔁 Récurrents",MEMORY_LINKS.filter(l=>l.type==="recurring").length],
    ["open","📌 Actions",MEMORY_LINKS.filter(l=>l.type==="open").length],
    ["context","🔗 Contexte",MEMORY_LINKS.filter(l=>l.type==="context").length],
  ];

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <Topbar title="Meeting Memory">
        <div style={{fontSize:12,color:C.text3,display:"flex",alignItems:"center",gap:6}}>
          <i className="ti ti-history" style={{fontSize:13,color:C.accent}}/>
          {MEMORY_MEETINGS.length} réunions · {MEMORY_LINKS.length} liens détectés
        </div>
        {aiLoading
          ? <div style={{display:"flex",alignItems:"center",gap:7,fontSize:12,color:C.accent,background:C.accentL,padding:"5px 12px",borderRadius:7}}>
              <div style={{width:10,height:10,borderRadius:"50%",border:`2px solid ${C.accent}`,borderTopColor:"transparent",animation:"spin .7s linear infinite"}}/>
              Analyse IA…
            </div>
          : <div style={{display:"flex",alignItems:"center",gap:6,fontSize:12,color:C.green,background:C.greenL,padding:"5px 12px",borderRadius:7}}>
              <i className="ti ti-sparkles" style={{fontSize:13}}/>Rapport prêt
            </div>
        }
      </Topbar>

      {/* Tabs */}
      <div style={{display:"flex",background:C.bg2,borderBottom:`1px solid ${C.border}`,flexShrink:0,paddingLeft:4}}>
        {[["liens","Liens détectés",MEMORY_LINKS.length],["rapport","Rapport IA",null],["since","Since last meeting",null]].map(([id,label,count])=>(
          <div key={id} onClick={()=>setActiveTab(id)}
            style={{padding:"11px 18px",fontSize:13,cursor:"pointer",
              color:activeTab===id?C.accent:C.text3,
              borderBottom:activeTab===id?`2px solid ${C.accent}`:"2px solid transparent",
              fontWeight:activeTab===id?500:400,transition:"all .15s",
              display:"flex",alignItems:"center",gap:7}}>
            {label}
            {count!=null&&<span style={{fontSize:10,fontWeight:700,padding:"1px 6px",borderRadius:10,background:C.accentL,color:C.accent}}>{count}</span>}
          </div>
        ))}
      </div>

      <div style={{flex:1,display:"flex",overflow:"hidden"}}>

        {/* TAB: LIENS */}
        {activeTab==="liens"&&(
          <>
            {/* Left panel — filter + link list */}
            <div style={{width:310,minWidth:310,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",overflow:"hidden"}}>
              <div style={{padding:"10px 12px",borderBottom:`1px solid ${C.border}`,display:"flex",gap:5,flexWrap:"wrap"}}>
                {filterChips.map(([id,label,count])=>(
                  <div key={id} onClick={()=>setFilterType(id)}
                    style={{fontSize:10,fontWeight:600,padding:"3px 8px",borderRadius:5,cursor:"pointer",
                      background:filterType===id?(id==="all"?C.accentL:typeBg(id)):"transparent",
                      color:filterType===id?(id==="all"?C.accent:typeColor(id)):C.text3,
                      border:`1px solid ${filterType===id?(id==="all"?C.accent+"44":typeColor(id)+"44"):C.border}`,
                      transition:"all .15s"}}>
                    {label} {count}
                  </div>
                ))}
              </div>
              <div style={{flex:1,overflowY:"auto"}}>
                {(selectedMeeting?linkedLinks:filteredLinks).map((link,i)=>{
                  const fromM=MEMORY_MEETINGS.find(m=>m.id===link.from);
                  const toM=MEMORY_MEETINGS.find(m=>m.id===link.to);
                  const isActive=selectedMeeting&&(link.from===selectedMeeting||link.to===selectedMeeting);
                  return (
                    <div key={i} style={{padding:"12px 14px",borderBottom:`1px solid ${C.border}`,
                      borderLeft:`3px solid ${typeColor(link.type)}`,
                      background:isActive?typeBg(link.type)+"55":"transparent"}}>
                      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:5}}>
                        <span style={{fontSize:11,fontWeight:700,color:typeColor(link.type),background:typeBg(link.type),padding:"2px 7px",borderRadius:4}}>
                          {typeIcon(link.type)} {typeLabel(link.type)}
                        </span>
                        {link.priority!=="INFO"&&<span style={{fontSize:9,fontWeight:700,padding:"2px 5px",borderRadius:3,background:prioBg(link.priority),color:prioColor(link.priority)}}>{link.priority}</span>}
                      </div>
                      <div style={{fontSize:12,fontWeight:500,color:C.text1,marginBottom:4}}>{link.label}</div>
                      <div style={{fontSize:11,color:C.text2,lineHeight:1.5,marginBottom:8}}>{link.text}</div>
                      <div style={{display:"flex",gap:5,flexWrap:"wrap"}}>
                        {[fromM,toM].filter(Boolean).map(m=>(
                          <div key={m.id} onClick={()=>setSelectedMeeting(selectedMeeting===m.id?null:m.id)}
                            style={{display:"flex",alignItems:"center",gap:4,fontSize:10,cursor:"pointer",
                              background:selectedMeeting===m.id?m.icolor+"22":C.bg3,
                              border:`1px solid ${selectedMeeting===m.id?m.icolor+"44":C.border}`,
                              color:selectedMeeting===m.id?m.icolor:C.text3,
                              padding:"2px 7px",borderRadius:4,transition:"all .15s"}}>
                            {m.icon} {m.date.split(" ").slice(0,2).join(" ")}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right panel — graph + detail */}
            <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
              {/* Graph */}
              <div style={{background:C.bg2,borderBottom:`1px solid ${C.border}`,padding:"14px 18px",flexShrink:0}}>
                <div style={{fontSize:10,color:C.text3,textTransform:"uppercase",letterSpacing:.6,fontWeight:600,marginBottom:10,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span>Timeline des connexions · <span style={{color:C.text3,fontWeight:400}}>cliquez sur un nœud</span></span>
                  <div style={{display:"flex",gap:14,fontSize:9}}>
                    {[["inconsistency","⚡ Incohérence",C.red],["recurring","🔁 Récurrent",C.amber],["open","📌 Action liée",C.teal],["context","🔗 Contexte",C.accent]].map(([t,l,c])=>(
                      <span key={t} style={{color:c,display:"flex",alignItems:"center",gap:4}}>
                        <span style={{width:14,height:1.5,background:c,display:"inline-block",borderRadius:1,flexShrink:0}}/>
                        {l}
                      </span>
                    ))}
                  </div>
                </div>
                <div style={{overflowX:"auto"}}>
                  <MemoryGraph
                    meetings={MEMORY_MEETINGS}
                    links={filterType==="all"?MEMORY_LINKS:MEMORY_LINKS.filter(l=>l.type===filterType)}
                    selectedId={selectedMeeting}
                    onSelect={setSelectedMeeting}
                  />
                </div>
              </div>

              {/* Meeting detail */}
              <div style={{flex:1,overflowY:"auto",padding:"18px 20px"}}>
                {!selectedMeeting?(
                  <div style={{textAlign:"center",padding:"40px 24px",color:C.text3}}>
                    <div style={{fontSize:32,marginBottom:12,opacity:.35}}>🔍</div>
                    <div style={{fontSize:14,color:C.text2,marginBottom:6}}>Sélectionnez une réunion</div>
                    <div style={{fontSize:12}}>Cliquez sur un nœud du graphe pour explorer ses liens</div>
                  </div>
                ):selMeetingData?(
                  <div>
                    <div style={{display:"flex",alignItems:"flex-start",gap:12,marginBottom:18,paddingBottom:16,borderBottom:`1px solid ${C.border}`}}>
                      <div style={{width:42,height:42,borderRadius:10,background:selMeetingData.color,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{selMeetingData.icon}</div>
                      <div style={{flex:1}}>
                        <div style={{fontSize:15,fontWeight:700,color:C.text1,marginBottom:4}}>{selMeetingData.name}</div>
                        <div style={{fontSize:12,color:C.text3,display:"flex",gap:12,flexWrap:"wrap"}}>
                          <span>📅 {selMeetingData.date}</span>
                          <span>🔗 {linkedLinks.length} lien{linkedLinks.length!==1?"s":""}</span>
                          {selMeetingData.openActions>0&&<span style={{color:C.red}}>⚠ {selMeetingData.openActions} action{selMeetingData.openActions!==1?"s":""} ouverte{selMeetingData.openActions!==1?"s":""}</span>}
                        </div>
                      </div>
                      <button onClick={()=>setPage("cr")} style={{background:C.accentL,border:`1px solid ${C.accent}33`,borderRadius:7,padding:"6px 12px",fontSize:11,fontWeight:600,color:C.accent,cursor:"pointer",flexShrink:0}}>Voir CR →</button>
                    </div>

                    <div style={{marginBottom:16}}>
                      <div style={{fontSize:10,color:C.text3,textTransform:"uppercase",letterSpacing:.6,fontWeight:600,marginBottom:8}}>Décisions clés</div>
                      {(selMeetingData.decisions||[]).map((d,i)=>(
                        <div key={i} style={{display:"flex",gap:9,padding:"7px 0",borderBottom:`1px solid ${C.border}`}}>
                          <div style={{width:18,height:18,borderRadius:4,background:C.accentL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,fontWeight:700,color:C.accent,flexShrink:0}}>{i+1}</div>
                          <div style={{fontSize:12,color:C.text1}}>{d}</div>
                        </div>
                      ))}
                    </div>

                    <div style={{marginBottom:16}}>
                      <div style={{fontSize:10,color:C.text3,textTransform:"uppercase",letterSpacing:.6,fontWeight:600,marginBottom:8}}>Systèmes impactés</div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                        {(selMeetingData.systems||[]).map(s=><span key={s} style={{fontSize:11,padding:"3px 9px",borderRadius:5,background:C.bg3,border:`1px solid ${C.border2}`,color:C.text2}}>{s}</span>)}
                      </div>
                    </div>

                    <div>
                      <div style={{fontSize:10,color:C.text3,textTransform:"uppercase",letterSpacing:.6,fontWeight:600,marginBottom:8}}>Alertes Memory liées</div>
                      {linkedLinks.map((link,i)=>{
                        const otherM=MEMORY_MEETINGS.find(m=>m.id===(link.from===selectedMeeting?link.to:link.from));
                        return (
                          <div key={i} style={{background:typeBg(link.type),border:`1px solid ${typeColor(link.type)}22`,borderRadius:9,padding:"11px 13px",marginBottom:9,borderLeft:`3px solid ${typeColor(link.type)}`}}>
                            <div style={{fontSize:10,fontWeight:700,color:typeColor(link.type),marginBottom:3}}>{typeIcon(link.type)} {typeLabel(link.type)}{link.priority!=="INFO"&&<span style={{fontSize:9,background:prioBg(link.priority),color:prioColor(link.priority),padding:"1px 5px",borderRadius:3,marginLeft:6}}>{link.priority}</span>}</div>
                            <div style={{fontSize:12,color:C.text1,fontWeight:500,marginBottom:4}}>{link.label}</div>
                            <div style={{fontSize:11,color:C.text2,lineHeight:1.5,marginBottom:6}}>{link.text}</div>
                            {otherM&&<div style={{fontSize:10,color:C.text3,display:"flex",alignItems:"center",gap:5}}>↔ <span style={{color:otherM.icolor}}>{otherM.icon} {otherM.name}</span> · {otherM.date}</div>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ):null}
              </div>
            </div>
          </>
        )}

        {/* TAB: RAPPORT IA */}
        {activeTab==="rapport"&&(
          <div style={{flex:1,overflowY:"auto",padding:"24px 28px"}}>
            {aiLoading?(
              <div style={{textAlign:"center",padding:"64px"}}>
                <div style={{width:44,height:44,borderRadius:"50%",border:`3px solid ${C.accent}`,borderTopColor:"transparent",animation:"spin .7s linear infinite",margin:"0 auto 16px"}}/>
                <div style={{fontSize:14,color:C.text1,marginBottom:6}}>Rapport IA en cours…</div>
                <div style={{fontSize:12,color:C.text3}}>Claude Sonnet 4 analyse {MEMORY_MEETINGS.length} réunions</div>
              </div>
            ):aiReport?(
              <div style={{maxWidth:800,margin:"0 auto"}}>
                <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:12,padding:"18px 22px",marginBottom:20}}>
                  <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10}}>
                    <i className="ti ti-sparkles" style={{fontSize:14,color:C.accent}}/>
                    <span style={{fontSize:13,fontWeight:600}}>Synthèse IA</span>
                    <span style={{fontSize:9,fontWeight:700,color:C.accent,background:C.accentL,padding:"2px 6px",borderRadius:3,textTransform:"uppercase",letterSpacing:.5}}>Claude Sonnet 4</span>
                  </div>
                  <div style={{fontSize:14,color:C.text2,lineHeight:1.8}}>{aiReport.synthesis}</div>
                </div>

                {(aiReport.hotTopics||[]).length>0&&(
                  <div style={{marginBottom:20}}>
                    <div style={{fontSize:11,color:C.text3,textTransform:"uppercase",letterSpacing:.6,fontWeight:600,marginBottom:12}}>Sujets récurrents</div>
                    {(aiReport.hotTopics||[]).map((t,i)=>(
                      <div key={i} style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 18px",marginBottom:10,display:"flex",gap:14,alignItems:"flex-start"}}>
                        <div style={{width:40,height:40,borderRadius:9,background:t.risk==="ÉLEVÉ"?C.redL:C.amberL,border:`1px solid ${t.risk==="ÉLEVÉ"?C.red+"33":C.amber+"33"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:t.risk==="ÉLEVÉ"?C.red:C.amber,flexShrink:0}}>{t.count}×</div>
                        <div style={{flex:1}}>
                          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
                            <span style={{fontSize:13,fontWeight:600,color:C.text1}}>{t.topic}</span>
                            <span style={{fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:4,background:t.risk==="ÉLEVÉ"?C.redL:C.amberL,color:t.risk==="ÉLEVÉ"?C.red:C.amber}}>{t.risk}</span>
                          </div>
                          <div style={{display:"flex",gap:5,marginBottom:6,flexWrap:"wrap"}}>
                            {(t.meetings||[]).map(m=><span key={m} style={{fontSize:10,background:C.bg3,border:`1px solid ${C.border}`,padding:"2px 6px",borderRadius:4,color:C.text3}}>{m}</span>)}
                          </div>
                          <div style={{fontSize:12,color:C.teal,display:"flex",alignItems:"center",gap:5}}><i className="ti ti-arrow-right" style={{fontSize:11}}/>{t.action}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {(aiReport.criticalInconsistencies||[]).length>0&&(
                  <div style={{marginBottom:20}}>
                    <div style={{fontSize:11,color:C.text3,textTransform:"uppercase",letterSpacing:.6,fontWeight:600,marginBottom:12}}>Incohérences critiques</div>
                    {(aiReport.criticalInconsistencies||[]).map((inc,i)=>(
                      <div key={i} style={{background:C.redL,border:`1px solid ${C.red}22`,borderRadius:10,padding:"14px 18px",marginBottom:10,borderLeft:`3px solid ${C.red}`}}>
                        <div style={{fontSize:13,fontWeight:600,color:C.text1,marginBottom:6}}>⚡ {inc.title}</div>
                        <div style={{fontSize:12,color:C.text2,lineHeight:1.6,marginBottom:8}}>{inc.detail}</div>
                        <div style={{display:"flex",gap:5,marginBottom:8,flexWrap:"wrap"}}>
                          {(inc.meetings||[]).map(m=><span key={m} style={{fontSize:10,background:C.bg3,border:`1px solid ${C.border}`,padding:"2px 6px",borderRadius:4,color:C.text3}}>{m}</span>)}
                        </div>
                        <div style={{fontSize:12,color:C.amber,background:C.amberL,border:`1px solid ${C.amber}33`,borderRadius:6,padding:"8px 12px"}}><strong>Recommandation :</strong> {inc.recommendation}</div>
                      </div>
                    ))}
                  </div>
                )}

                {(aiReport.openActionsAtRisk||[]).length>0&&(
                  <div>
                    <div style={{fontSize:11,color:C.text3,textTransform:"uppercase",letterSpacing:.6,fontWeight:600,marginBottom:12}}>Actions à risque</div>
                    <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
                      <div style={{display:"grid",gridTemplateColumns:"1fr 90px 100px 1fr",padding:"7px 16px",background:C.bg3,fontSize:9,color:C.text3,textTransform:"uppercase",letterSpacing:.5,fontWeight:600,gap:12}}>
                        <span>Action</span><span>Owner</span><span>Deadline</span><span>Bloqué par</span>
                      </div>
                      {(aiReport.openActionsAtRisk||[]).map((a,i)=>(
                        <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 90px 100px 1fr",padding:"10px 16px",borderTop:`1px solid ${C.border}`,gap:12,alignItems:"center",background:i%2?"transparent":`${C.bg3}88`}}>
                          <span style={{fontSize:12,color:C.text1}}>{a.action}</span>
                          <span style={{fontSize:11,fontWeight:600,color:C.accent}}>{a.owner}</span>
                          <span style={{fontSize:11,color:C.red}}>{a.dueDate}</span>
                          <span style={{fontSize:11,color:C.text3}}>{a.blockedBy}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ):<div style={{textAlign:"center",padding:"48px",color:C.text3,fontSize:13}}>Rapport non disponible.</div>}
          </div>
        )}

        {/* TAB: SINCE LAST MEETING */}
        {activeTab==="since"&&(
          <div style={{flex:1,overflowY:"auto",padding:"24px 28px"}}>
            <div style={{maxWidth:680,margin:"0 auto"}}>
              <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:12,padding:"14px 18px",marginBottom:18,display:"flex",alignItems:"center",gap:12}}>
                <div style={{width:38,height:38,borderRadius:9,background:C.accentL,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>📅</div>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:C.text1}}>Depuis la dernière réunion</div>
                  <div style={{fontSize:12,color:C.text3}}>Résumé automatique · Vue {sel.label}</div>
                </div>
                {aiLoading&&<div style={{marginLeft:"auto",width:11,height:11,borderRadius:"50%",border:`2px solid ${C.accent}`,borderTopColor:"transparent",animation:"spin .7s linear infinite"}}/>}
              </div>

              {aiReport?.sinceLastMeeting?(
                <>
                  {[
                    {key:"completed", icon:"ti ti-circle-check", color:C.green, bg:C.greenL, border:C.green+"22", label:"Actions complétées", emptyMsg:"Aucune action complétée.", prefixIcon:"✓"},
                    {key:"overdue",   icon:"ti ti-alert-circle",  color:C.red,   bg:C.redL,   border:C.red+"22",   label:"Actions en retard",   emptyMsg:"Aucune action en retard.",   prefixIcon:"↻"},
                    {key:"newRisks",  icon:"ti ti-alert-triangle",color:C.amber, bg:C.amberL, border:C.amber+"22", label:"Nouveaux risques",     emptyMsg:"Aucun nouveau risque.",      prefixIcon:"⚠"},
                  ].map(({key,icon,color,bg,border,label,emptyMsg,prefixIcon})=>(
                    <div key={key} style={{background:bg,border:`1px solid ${border}`,borderRadius:10,overflow:"hidden",marginBottom:12}}>
                      <div style={{padding:"11px 16px",borderBottom:`1px solid ${border}`,display:"flex",alignItems:"center",gap:8}}>
                        <i className={icon} style={{fontSize:14,color}}/>
                        <span style={{fontSize:13,fontWeight:600,color:C.text1}}>{label}</span>
                        <span style={{fontSize:10,fontWeight:700,background:bg,color,padding:"1px 6px",borderRadius:10,border:`1px solid ${border}`}}>{(aiReport.sinceLastMeeting[key]||[]).length}</span>
                      </div>
                      <div style={{padding:"6px 0"}}>
                        {(aiReport.sinceLastMeeting[key]||[]).length===0
                          ?<div style={{padding:"10px 16px",fontSize:12,color:C.text3,fontStyle:"italic"}}>{emptyMsg}</div>
                          :(aiReport.sinceLastMeeting[key]||[]).map((a,i,arr)=>(
                            <div key={i} style={{display:"flex",gap:10,padding:"8px 16px",borderBottom:i<arr.length-1?`1px solid ${border}`:"none"}}>
                              <span style={{color,fontSize:13,flexShrink:0}}>{prefixIcon}</span>
                              <span style={{fontSize:12,color:C.text2}}>{a}</span>
                            </div>
                          ))
                        }
                      </div>
                    </div>
                  ))}
                </>
              ):aiLoading
                ?<div style={{textAlign:"center",padding:"40px",color:C.text3,fontSize:13}}>Chargement du rapport…</div>
                :<div style={{textAlign:"center",padding:"40px",color:C.text3,fontSize:13}}>Rapport non disponible.</div>
              }
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
