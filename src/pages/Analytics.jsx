import { useState } from "react";
import { C, ROLES } from "../lib/constants";
import { Btn } from "../components/ui/Btn";
import { Topbar } from "../components/layout/Topbar";
import { Sparkline } from "../components/charts/Sparkline";
import { DonutChart } from "../components/charts/DonutChart";

const ANALYTICS_DATA = {
  // KPIs globaux
  kpis: [
    { label:"Réunions analysées",  value:24,  delta:"+4",   deltaUp:true,  sub:"ce mois",   color:C.accent,  icon:"calendar-event" },
    { label:"Actions créées",      value:87,  delta:"+12",  deltaUp:true,  sub:"ce mois",   color:C.teal,    icon:"checkbox" },
    { label:"Actions clôturées",   value:61,  delta:"70%",  deltaUp:true,  sub:"taux résolution", color:C.green, icon:"circle-check" },
    { label:"Risques détectés",    value:18,  delta:"-3",   deltaUp:true,  sub:"vs mois dernier", color:C.red,  icon:"alert-triangle" },
    { label:"Questions ouvertes",  value:9,   delta:"+2",   deltaUp:false, sub:"non tranchées",   color:C.amber, icon:"question-mark" },
    { label:"Incohérences Memory", value:6,   delta:"+2",   deltaUp:false, sub:"détectées",  color:C.purple,  icon:"history" },
  ],

  // Réunions par semaine (8 dernières semaines)
  meetingsPerWeek: [
    { week:"S18", count:2, decisions:4,  actions:8,  risks:2 },
    { week:"S19", count:3, decisions:7,  actions:14, risks:3 },
    { week:"S20", count:2, decisions:5,  actions:10, risks:4 },
    { week:"S21", count:4, decisions:9,  actions:18, risks:5 },
    { week:"S22", count:2, decisions:6,  actions:11, risks:2 },
    { week:"S23", count:3, decisions:8,  actions:15, risks:3 },
    { week:"S24", count:5, decisions:12, actions:22, risks:6 },
    { week:"S25", count:3, decisions:7,  actions:14, risks:3 },
  ],

  // Actions par statut
  actionStatus: [
    { label:"Complétées", value:61, color:C.green  },
    { label:"En cours",   value:18, color:C.accent },
    { label:"En retard",  value:8,  color:C.red    },
  ],

  // Systèmes les plus impactés
  topSystems: [
    { name:"Azure / Cloud",   count:8,  trend:"up",   color:C.accent  },
    { name:"IAM / Azure AD",  count:6,  trend:"up",   color:C.purple  },
    { name:"API Gateway",     count:5,  trend:"flat", color:C.teal    },
    { name:"ERP / SAP",       count:4,  trend:"down", color:C.amber   },
    { name:"Kafka / Middleware", count:4, trend:"up", color:C.red     },
    { name:"Data Platform",   count:3,  trend:"up",   color:C.green   },
    { name:"Infra / Network", count:3,  trend:"flat", color:C.text2   },
  ],

  // Types de décisions
  decisionTypes: [
    { label:"Architecture",  value:28, color:C.accent  },
    { label:"Technique",     value:22, color:C.teal    },
    { label:"Organisationnelle", value:18, color:C.amber},
    { label:"Compliance",    value:14, color:C.red     },
    { label:"Budget",        value:10, color:C.purple  },
    { label:"Autre",         value:8,  color:C.text3   },
  ],

  // Sujets récurrents (heatmap)
  recurringTopics: [
    { topic:"Kafka performance",     count:4, last:"20 mai",  risk:"ÉLEVÉ"  },
    { topic:"Middleware X compliance",count:3, last:"25 mai",  risk:"ÉLEVÉ"  },
    { topic:"Sizing infra",          count:3, last:"25 mai",  risk:"MOYEN"  },
    { topic:"IAM / Azure AD",        count:3, last:"25 mai",  risk:"MOYEN"  },
    { topic:"Budget opex cloud",     count:2, last:"22 mai",  risk:"FAIBLE" },
    { topic:"DR / RTO Azure",        count:2, last:"25 mai",  risk:"MOYEN"  },
    { topic:"API Gateway routes",    count:2, last:"24 mai",  risk:"FAIBLE" },
  ],

  // Tendance qualité (ratio décisions / réunion)
  qualityTrend: [3.2, 2.8, 2.5, 3.6, 3.0, 2.7, 3.4, 2.8],
};

export function PageAnalytics({ setPage, role }) {
  const [period, setPeriod] = useState("month"); // week | month | quarter
  const [kpiMetric, setKpiMetric] = useState("count"); // count | decisions | actions | risks
  const sel = ROLES.find(r => r.id === role) || ROLES[0];

  const data = ANALYTICS_DATA;
  const riskColor = r => r==="ÉLEVÉ"?C.red:r==="MOYEN"?C.amber:C.green;
  const riskBg    = r => r==="ÉLEVÉ"?C.redL:r==="MOYEN"?C.amberL:C.greenL;
  const trendIcon = t => t==="up"?"↑":t==="down"?"↓":"→";
  const trendCol  = t => t==="up"?C.green:t==="down"?C.red:C.text3;

  // Metric selector for bar chart
  const metricOptions = [
    { id:"count",     label:"Réunions",  color:C.accent },
    { id:"decisions", label:"Décisions", color:C.teal   },
    { id:"actions",   label:"Actions",   color:C.green  },
    { id:"risks",     label:"Risques",   color:C.red    },
  ];
  const selMetric = metricOptions.find(m => m.id === kpiMetric);

  return (
    <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <Topbar title="Analytics">
        {/* Period selector */}
        <div style={{display:"flex",background:C.bg3,borderRadius:7,padding:3,gap:0}}>
          {[["week","7j"],["month","30j"],["quarter","3 mois"]].map(([id,label])=>(
            <button key={id} onClick={()=>setPeriod(id)}
              style={{padding:"5px 12px",borderRadius:5,fontSize:11,fontWeight:500,
                border:"none",cursor:"pointer",transition:"all .15s",
                background:period===id?C.bg4:"transparent",
                color:period===id?C.text1:C.text3}}>
              {label}
            </button>
          ))}
        </div>
        <Btn onClick={()=>setPage("upload")} primary>
          <i className="ti ti-file-export" style={{fontSize:13}}/>Exporter
        </Btn>
      </Topbar>

      <div style={{flex:1,overflowY:"auto",padding:"20px 22px"}}>

        {/* KPI CARDS */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:10,marginBottom:20}}>
          {data.kpis.map((kpi,i)=>(
            <div key={i} style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,padding:"14px 14px"}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
                <div style={{width:28,height:28,borderRadius:7,background:`${kpi.color}18`,
                  display:"flex",alignItems:"center",justifyContent:"center"}}>
                  <i className={`ti ti-${kpi.icon}`} style={{fontSize:14,color:kpi.color}}/>
                </div>
                <span style={{fontSize:10,fontWeight:700,padding:"2px 6px",borderRadius:4,
                  background:kpi.deltaUp?C.greenL:C.redL,
                  color:kpi.deltaUp?C.green:C.red}}>{kpi.delta}</span>
              </div>
              <div style={{fontSize:24,fontWeight:800,color:kpi.color,letterSpacing:-1,lineHeight:1,marginBottom:4}}>
                {kpi.value}
              </div>
              <div style={{fontSize:10,color:C.text3,lineHeight:1.3}}>{kpi.label}</div>
              <div style={{fontSize:9,color:C.text3,marginTop:2}}>{kpi.sub}</div>
            </div>
          ))}
        </div>

        {/* ROW 1 — Volume + Actions donut */}
        <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:14,marginBottom:14}}>

          {/* Volume chart */}
          <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
            <div style={{padding:"12px 18px",borderBottom:`1px solid ${C.border}`,
              display:"flex",alignItems:"center",justifyContent:"space-between"}}>
              <div style={{fontSize:13,fontWeight:600}}>Volume par semaine</div>
              <div style={{display:"flex",gap:4}}>
                {metricOptions.map(m=>(
                  <button key={m.id} onClick={()=>setKpiMetric(m.id)}
                    style={{fontSize:10,fontWeight:600,padding:"3px 8px",borderRadius:5,border:"none",cursor:"pointer",
                      background:kpiMetric===m.id?`${m.color}22`:"transparent",
                      color:kpiMetric===m.id?m.color:C.text3,transition:"all .15s"}}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
            <div style={{padding:"16px 18px"}}>
              {/* Bars */}
              <div style={{display:"flex",alignItems:"flex-end",gap:6,height:120,marginBottom:8}}>
                {data.meetingsPerWeek.map((w,i)=>{
                  const max = Math.max(...data.meetingsPerWeek.map(d=>d[kpiMetric]));
                  const pct = w[kpiMetric] / max;
                  const isLast = i === data.meetingsPerWeek.length - 1;
                  return (
                    <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
                      <div style={{fontSize:9,color:isLast?selMetric.color:C.text3,fontWeight:isLast?700:400}}>
                        {w[kpiMetric]}
                      </div>
                      <div style={{width:"100%",display:"flex",alignItems:"flex-end",height:96,position:"relative"}}>
                        {/* Background bar */}
                        <div style={{position:"absolute",bottom:0,width:"100%",height:"100%",background:C.bg3,borderRadius:"4px 4px 0 0"}}/>
                        {/* Value bar */}
                        <div style={{position:"relative",width:"100%",height:`${pct*100}%`,
                          background:isLast?selMetric.color:`${selMetric.color}55`,
                          borderRadius:"4px 4px 0 0",transition:"height .5s ease",
                          minHeight:3}}/>
                      </div>
                      <div style={{fontSize:8,color:C.text3}}>{w.week}</div>
                    </div>
                  );
                })}
              </div>
              {/* Sparkline tendance */}
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                paddingTop:10,borderTop:`1px solid ${C.border}`,marginTop:4}}>
                <div style={{fontSize:11,color:C.text3}}>Tendance qualité (décisions/réunion)</div>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <Sparkline values={data.qualityTrend} color={C.accent} height={30} width={100}/>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontSize:14,fontWeight:700,color:C.accent}}>{data.qualityTrend.at(-1)}</div>
                    <div style={{fontSize:9,color:C.text3}}>déc/réunion</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions donut */}
          <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
            <div style={{padding:"12px 18px",borderBottom:`1px solid ${C.border}`,fontSize:13,fontWeight:600}}>
              Statut des actions
            </div>
            <div style={{padding:"18px",display:"flex",flexDirection:"column",alignItems:"center",gap:16}}>
              <div style={{position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center"}}>
                <DonutChart segments={data.actionStatus} size={110} thickness={20}/>
                <div style={{position:"absolute",textAlign:"center"}}>
                  <div style={{fontSize:20,fontWeight:800,color:C.green,lineHeight:1}}>
                    {Math.round(data.actionStatus[0].value / data.actionStatus.reduce((s,d)=>s+d.value,0)*100)}%
                  </div>
                  <div style={{fontSize:8,color:C.text3}}>résolution</div>
                </div>
              </div>
              <div style={{width:"100%",display:"flex",flexDirection:"column",gap:7}}>
                {data.actionStatus.map((s,i)=>{
                  const total = data.actionStatus.reduce((a,d)=>a+d.value,0);
                  return (
                    <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{width:7,height:7,borderRadius:"50%",background:s.color,flexShrink:0}}/>
                      <span style={{fontSize:12,color:C.text2,flex:1}}>{s.label}</span>
                      <span style={{fontSize:12,fontWeight:700,color:s.color}}>{s.value}</span>
                      <span style={{fontSize:10,color:C.text3,width:28,textAlign:"right"}}>{Math.round(s.value/total*100)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2 — Systèmes impactés + Types de décisions */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:14}}>

          {/* Systèmes impactés */}
          <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
            <div style={{padding:"12px 18px",borderBottom:`1px solid ${C.border}`,fontSize:13,fontWeight:600}}>
              Systèmes les plus impactés
            </div>
            <div style={{padding:"8px 0"}}>
              {data.topSystems.map((sys,i)=>{
                const max = data.topSystems[0].count;
                const pct = sys.count / max * 100;
                return (
                  <div key={i} style={{padding:"9px 18px",borderBottom:i<data.topSystems.length-1?`1px solid ${C.border}`:"none"}}>
                    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <div style={{width:7,height:7,borderRadius:"50%",background:sys.color,flexShrink:0}}/>
                        <span style={{fontSize:12,fontWeight:500,color:C.text1}}>{sys.name}</span>
                      </div>
                      <div style={{display:"flex",alignItems:"center",gap:8}}>
                        <span style={{fontSize:10,color:trendCol(sys.trend),fontWeight:600}}>{trendIcon(sys.trend)}</span>
                        <span style={{fontSize:12,fontWeight:700,color:sys.color}}>{sys.count}</span>
                        <span style={{fontSize:10,color:C.text3}}>réunion{sys.count>1?"s":""}</span>
                      </div>
                    </div>
                    <div style={{height:3,background:C.bg4,borderRadius:2,overflow:"hidden"}}>
                      <div style={{height:"100%",width:`${pct}%`,background:sys.color,borderRadius:2,opacity:.7,transition:"width .5s ease"}}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Types de décisions */}
          <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
            <div style={{padding:"12px 18px",borderBottom:`1px solid ${C.border}`,fontSize:13,fontWeight:600}}>
              Types de décisions
            </div>
            <div style={{padding:"18px",display:"flex",gap:20,alignItems:"center"}}>
              <div style={{position:"relative",display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                <DonutChart segments={data.decisionTypes} size={120} thickness={22}/>
                <div style={{position:"absolute",textAlign:"center"}}>
                  <div style={{fontSize:18,fontWeight:800,color:C.text1,lineHeight:1}}>
                    {data.decisionTypes.reduce((s,d)=>s+d.value,0)}
                  </div>
                  <div style={{fontSize:8,color:C.text3}}>décisions</div>
                </div>
              </div>
              <div style={{flex:1,display:"flex",flexDirection:"column",gap:7}}>
                {data.decisionTypes.map((d,i)=>{
                  const total = data.decisionTypes.reduce((s,x)=>s+x.value,0);
                  return (
                    <div key={i} style={{display:"flex",alignItems:"center",gap:7}}>
                      <div style={{width:7,height:7,borderRadius:"50%",background:d.color,flexShrink:0}}/>
                      <span style={{fontSize:11,color:C.text2,flex:1}}>{d.label}</span>
                      <span style={{fontSize:11,fontWeight:700,color:d.color}}>{d.value}</span>
                      <span style={{fontSize:10,color:C.text3,width:26,textAlign:"right"}}>{Math.round(d.value/total*100)}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ROW 3 — Sujets récurrents heatmap */}
        <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden",marginBottom:14}}>
          <div style={{padding:"12px 18px",borderBottom:`1px solid ${C.border}`,
            display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:8}}>
              Sujets récurrents détectés
              <span style={{fontSize:10,fontWeight:700,color:C.red,background:C.redL,padding:"2px 7px",borderRadius:4}}>
                ⚡ Meeting Memory
              </span>
            </div>
            <span onClick={()=>setPage("memory")} style={{fontSize:11,color:C.accent,cursor:"pointer",fontWeight:500}}>
              Voir dans Memory →
            </span>
          </div>
          <div style={{padding:"0"}}>
            {/* Header */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 80px 120px 90px 1fr",
              padding:"7px 18px",background:C.bg3,fontSize:9,color:C.text3,
              textTransform:"uppercase",letterSpacing:.5,fontWeight:600,gap:12}}>
              <span>Sujet</span><span>Occurrences</span><span>Intensité</span><span>Risque</span><span>Action recommandée</span>
            </div>
            {data.recurringTopics.map((t,i)=>{
              const maxC = 4;
              const dots = Array.from({length:maxC},(_,j)=>j<t.count);
              return (
                <div key={i} style={{display:"grid",gridTemplateColumns:"1fr 80px 120px 90px 1fr",
                  padding:"10px 18px",borderTop:`1px solid ${C.border}`,gap:12,
                  alignItems:"center",background:i%2===0?"transparent":`${C.bg3}66`}}>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    <div style={{width:6,height:6,borderRadius:"50%",background:riskColor(t.risk),flexShrink:0}}/>
                    <span style={{fontSize:12,fontWeight:500,color:C.text1}}>{t.topic}</span>
                  </div>
                  <span style={{fontSize:12,fontWeight:700,color:riskColor(t.risk),textAlign:"center"}}>{t.count}×</span>
                  <div style={{display:"flex",gap:4,alignItems:"center"}}>
                    {dots.map((filled,j)=>(
                      <div key={j} style={{width:14,height:14,borderRadius:3,
                        background:filled?riskColor(t.risk)+`${["CC","99","77","55"][j]||"55"}`:`${C.bg4}`,
                        border:`1px solid ${filled?riskColor(t.risk)+"44":C.border}`,
                        transition:"background .2s"}}/>
                    ))}
                  </div>
                  <span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:4,
                    background:riskBg(t.risk),color:riskColor(t.risk),textAlign:"center"}}>
                    {t.risk}
                  </span>
                  <span style={{fontSize:11,color:C.text3}}>
                    {t.risk==="ÉLEVÉ"?"→ Chantier dédié à créer":t.risk==="MOYEN"?"→ Owner à désigner":"→ Surveiller"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ROW 4 — Tendances dans le temps (multi-ligne) */}
        <div style={{background:C.bg2,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
          <div style={{padding:"12px 18px",borderBottom:`1px solid ${C.border}`,fontSize:13,fontWeight:600,
            display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <span>Tendances sur 8 semaines</span>
            <div style={{display:"flex",gap:14,fontSize:10}}>
              {[{c:C.accent,l:"Réunions"},{c:C.teal,l:"Actions"},{c:C.red,l:"Risques"}].map(({c,l})=>(
                <span key={l} style={{color:c,display:"flex",alignItems:"center",gap:5}}>
                  <span style={{width:16,height:1.5,background:c,display:"inline-block",borderRadius:1}}/>
                  {l}
                </span>
              ))}
            </div>
          </div>
          <div style={{padding:"16px 18px"}}>
            {/* Multi-series area chart */}
            <svg width="100%" height="120" viewBox="0 0 700 120" preserveAspectRatio="none" style={{overflow:"visible"}}>
              {/* Grid lines */}
              {[0,30,60,90].map(y=>(
                <line key={y} x1="0" y1={y} x2="700" y2={y} stroke={C.border} strokeWidth="1"/>
              ))}
              {/* Données */}
              {[
                {key:"count",    color:C.accent,  mult:6},
                {key:"risks",    color:C.red,     mult:3.5},
              ].map(({key,color,mult})=>{
                const vals = data.meetingsPerWeek.map(w=>w[key]);
                const max  = Math.max(...vals);
                const pts  = vals.map((v,i)=>{
                  const x = (i/(vals.length-1))*700;
                  const y = 100 - (v/max)*90;
                  return `${x},${y}`;
                }).join(" ");
                const fillPts = `0,100 ${pts} 700,100`;
                return (
                  <g key={key}>
                    <polygon points={fillPts} fill={color} opacity="0.07"/>
                    <polyline points={pts} fill="none" stroke={color} strokeWidth="2"
                      strokeLinecap="round" strokeLinejoin="round" opacity="0.8"/>
                    {vals.map((v,i)=>{
                      const x=(i/(vals.length-1))*700;
                      const y=100-(v/max)*90;
                      return <circle key={i} cx={x} cy={y} r="3" fill={color} opacity={i===vals.length-1?1:.5}/>;
                    })}
                  </g>
                );
              })}
              {/* Actions line (different scale) */}
              {(()=>{
                const vals=data.meetingsPerWeek.map(w=>w.actions);
                const max=Math.max(...vals);
                const pts=vals.map((v,i)=>`${(i/(vals.length-1))*700},${100-(v/max)*90}`).join(" ");
                return (
                  <g>
                    <polyline points={pts} fill="none" stroke={C.teal} strokeWidth="2" strokeDasharray="5,3"
                      strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
                    {vals.map((v,i)=>{
                      const x=(i/(vals.length-1))*700;
                      const y=100-(v/max)*90;
                      return <circle key={i} cx={x} cy={y} r="2.5" fill={C.teal} opacity={i===vals.length-1?1:.5}/>;
                    })}
                  </g>
                );
              })()}
            </svg>
            {/* X labels */}
            <div style={{display:"flex",justifyContent:"space-between",marginTop:6}}>
              {data.meetingsPerWeek.map((w,i)=>(
                <div key={i} style={{fontSize:9,color:i===data.meetingsPerWeek.length-1?C.accent:C.text3,
                  fontWeight:i===data.meetingsPerWeek.length-1?600:400,textAlign:"center"}}>
                  {w.week}
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
