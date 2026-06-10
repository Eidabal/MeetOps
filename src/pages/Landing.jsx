import { useState, useEffect } from "react";
import { C } from "../lib/constants";
import { mColor, mBg } from "../lib/format";
import { Particles } from "../components/ui/Particles";
import { Reveal } from "../components/ui/Reveal";

export function LandingPage({ onStart }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const steps = [
    { n:"01", icon:"🎙️", title:"Importez votre réunion",      desc:"Audio, vidéo, export Teams/Zoom ou transcription. Tous les formats acceptés.", tag:"MP4 · MP3 · VTT · TXT · DOCX" },
    { n:"02", icon:"🧠", title:"L'IA analyse en profondeur",   desc:"Transcription, diarisation, extraction sémantique — tout est détecté automatiquement.", tag:"7 étapes d'analyse IA" },
    { n:"03", icon:"📋", title:"Next steps contextualisés",    desc:"CR adapté à votre rôle, lié à vos réunions passées — next steps spécifiques à cette réunion.", tag:"Personnalisé & exportable" },
  ];

  const features = [
    { icon:"⚡", title:"Analyse IA en temps réel",   desc:"Pipeline de 7 étapes — transcription, NLP, extraction sémantique. Résultat en moins de 2 minutes.", tags:[{l:"Décisions",c:C.accent,bg:C.accentL},{l:"Actions",c:C.teal,bg:C.tealL},{l:"Risques",c:C.red,bg:C.redL}] },
    { icon:"🎯", title:"Vue adaptée à votre rôle",   desc:"Architect, PM, Security, PO, Delivery, IT Manager — CR réorienté sur ce qui compte pour vous.", tags:[{l:"🏗 Architect",c:C.accent,bg:C.accentL},{l:"📋 PM",c:C.teal,bg:C.tealL},{l:"🔒 Security",c:C.amber,bg:C.amberL}] },
    { icon:"🧠", title:"Meeting Memory",             desc:"Incohérences entre CRs, actions ouvertes, sujets récurrents — contexte instantané à chaque réunion.", tags:[{l:"⚡ Incohérences",c:C.red,bg:C.redL},{l:"🔗 Contexte",c:C.accent,bg:C.accentL},{l:"🔁 Récurrents",c:C.amber,bg:C.amberL}] },
    { icon:"📤", title:"Export & intégrations",      desc:"Word, Jira, Teams, ServiceNow — vos actions deviennent des tickets automatiquement.", tags:[{l:"📘 Word",c:"#2B79D4",bg:"rgba(43,121,212,0.12)"},{l:"🔵 Jira",c:"#2684FF",bg:"rgba(38,132,255,0.12)"},{l:"💜 Teams",c:"#6264A7",bg:"rgba(98,100,167,0.15)"}] },
  ];

  const prices = [
    { label:"Starter", amount:"0€",       period:"pour toujours · 1 utilisateur", desc:"Pour découvrir et analyser vos premières réunions.", ok:["5 réunions / mois","CR structuré complet","Export Word"], ko:["Meeting Memory","Next steps IA","Intégrations"], cta:"Commencer gratuitement", featured:false },
    { label:"Pro",     amount:"39€",       period:"/ utilisateur / mois",          desc:"Pour les équipes IT qui veulent tirer le meilleur de chaque réunion.", ok:["Réunions illimitées","CR structuré complet","Export Word, Jira, Teams","Meeting Memory complète","Vue par rôle (6 rôles)","Next steps IA contextualisés"], ko:[], cta:"Essai gratuit 14j", featured:true },
    { label:"Entreprise", amount:"Sur mesure", period:"à partir de 20 utilisateurs", desc:"Pour les grandes DSI et programmes de transformation IT.", ok:["Tout ce qui est dans Pro","SSO & SAML","Déploiement on-premise","SLA dédié","Intégration ServiceNow","Audit logs"], ko:[], cta:"Contacter l'équipe", featured:false },
  ];

  const testimonials = [
    { q:"La Meeting Memory est bluffante. Elle a détecté une incohérence entre deux décisions prises à 3 semaines d'écart — on ne l'aurait jamais vu.", name:"Jean Dupont", role:"Enterprise Architect · BNP Paribas", av:"JD", grad:"linear-gradient(135deg,#6366F1,#A78BFA)" },
    { q:"On a réduit notre temps de CR de 3h à 10 minutes. Et les next steps IA sont vraiment contextualisés à la réunion — pas des suggestions génériques.", name:"Sophie Laurent", role:"Program Manager · Capgemini", av:"SL", grad:"linear-gradient(135deg,#2DD4BF,#06B6D4)" },
    { q:"La vue Security me donne immédiatement IAM, compliance, risques. Et quand un sujet de compliance est récurrent depuis 4 réunions, j'en suis alertée.", name:"Karim Merah", role:"CISO · Société Générale", av:"KM", grad:"linear-gradient(135deg,#FBBF24,#F59E0B)" },
  ];

  return (
    <div style={{background:C.bg,color:C.text1,fontFamily:"'DM Sans',system-ui,sans-serif",overflowX:"hidden"}}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,400;1,700&display=swap');
        .lp-serif{font-family:'Playfair Display',Georgia,serif}
      `}</style>

      {/* NAV */}
      <nav style={{position:"fixed",top:0,left:0,right:0,zIndex:900,display:"flex",alignItems:"center",padding:"0 40px",height:60,background:scrolled?"rgba(9,9,15,0.92)":"transparent",backdropFilter:scrolled?"blur(20px)":"none",borderBottom:scrolled?`1px solid ${C.border}`:"none",transition:"all .3s"}}>
        <div style={{display:"flex",alignItems:"center",gap:9}}>
          <div style={{width:30,height:30,borderRadius:8,background:"linear-gradient(135deg,#6366F1,#A78BFA)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:15}}>🧠</div>
          <span className="lp-serif" style={{fontSize:17,fontWeight:700,color:C.text1}}>MeetCopilot</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:24,marginLeft:"auto",marginRight:24}}>
          {["Fonctionnalités","Tarifs","Témoignages"].map(l=><a key={l} href="#" style={{fontSize:13,color:C.text2,textDecoration:"none"}}>{l}</a>)}
        </div>
        <button onClick={onStart} style={{fontSize:13,fontWeight:600,color:"white",background:"linear-gradient(135deg,#6366F1,#A78BFA)",border:"none",borderRadius:8,padding:"8px 18px",cursor:"pointer",boxShadow:"0 3px 14px rgba(99,102,241,0.35)"}}>Commencer gratuitement</button>
      </nav>

      {/* HERO */}
      <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",textAlign:"center",padding:"120px 24px 80px",position:"relative",overflow:"hidden"}}>
        <Particles/>
        <div style={{position:"absolute",top:-150,left:"50%",transform:"translateX(-50%)",width:700,height:500,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(99,102,241,0.13) 0%,transparent 70%)",pointerEvents:"none"}}/>
        <div style={{position:"relative",zIndex:2}}>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"rgba(201,168,76,0.1)",border:"1px solid rgba(201,168,76,0.22)",borderRadius:20,padding:"6px 16px",fontSize:12,color:"#E8C97A",fontWeight:500,marginBottom:28}}>✦ AI Meeting OS · Next steps contextualisés</div>
          <h1 className="lp-serif" style={{fontSize:"clamp(48px,7vw,86px)",fontWeight:900,lineHeight:1.05,letterSpacing:"-2px",color:C.text1,marginBottom:10}}>Chaque réunion,<br/><em style={{color:"#E8C97A"}}>transformée.</em></h1>
          <div className="lp-serif" style={{fontSize:"clamp(28px,4vw,52px)",fontWeight:400,fontStyle:"italic",color:C.text2,letterSpacing:"-1px",marginBottom:24}}>En quelques secondes.</div>
          <p style={{fontSize:17,color:C.text2,maxWidth:500,lineHeight:1.7,fontWeight:300,margin:"0 auto 36px"}}>MeetCopilot analyse vos réunions et génère <strong style={{color:C.text1,fontWeight:500}}>comptes rendus structurés, next steps contextualisés</strong> liés à vos réunions passées — adaptés à votre rôle.</p>
          <div style={{display:"flex",alignItems:"center",gap:12,justifyContent:"center",marginBottom:36}}>
            <button onClick={onStart} style={{display:"flex",alignItems:"center",gap:8,fontSize:15,fontWeight:600,color:"white",background:"linear-gradient(135deg,#6366F1,#A78BFA)",border:"none",borderRadius:10,padding:"14px 32px",cursor:"pointer",boxShadow:"0 6px 28px rgba(99,102,241,0.42)"}}>
              <i className="ti ti-sparkles" style={{fontSize:16}}/> Essayer gratuitement
            </button>
            <button style={{display:"flex",alignItems:"center",gap:8,fontSize:14,color:C.text2,background:"transparent",border:`1px solid ${C.border2}`,borderRadius:10,padding:"13px 22px",cursor:"pointer"}}>
              <i className="ti ti-play" style={{fontSize:14}}/> Voir la démo
            </button>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:20,fontSize:12,color:C.text3,justifyContent:"center"}}>
            <span><i className="ti ti-shield-check" style={{fontSize:13}}/> SOC 2 Type II</span>
            <span><i className="ti ti-lock" style={{fontSize:13}}/> RGPD compliant</span>
            <span><i className="ti ti-building" style={{fontSize:13}}/> 400+ équipes IT</span>
          </div>
        </div>
        {/* Mini mockup */}
        <Reveal style={{marginTop:64,width:"100%",maxWidth:880,position:"relative",zIndex:2}}>
          <div style={{position:"absolute",inset:-30,background:"radial-gradient(ellipse at 50% 40%,rgba(99,102,241,0.1),transparent 70%)",pointerEvents:"none",borderRadius:20}}/>
          <div style={{background:C.bg2,border:`1px solid ${C.border2}`,borderRadius:14,overflow:"hidden",boxShadow:"0 40px 100px rgba(0,0,0,0.6)"}}>
            <div style={{height:34,background:C.bg3,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",padding:"0 14px",gap:7}}>
              {[C.red,C.amber,C.green].map(cl=><div key={cl} style={{width:9,height:9,borderRadius:"50%",background:cl}}/>)}
              <div style={{flex:1,background:C.bg4,borderRadius:4,height:18,marginLeft:8,display:"flex",alignItems:"center",padding:"0 10px"}}><span style={{fontFamily:"monospace",fontSize:9,color:C.text3}}>app.meetcopilot.ai/cr/migration-azure</span></div>
            </div>
            <div style={{display:"flex",height:320}}>
              <div style={{width:165,background:C.bg3,borderRight:`1px solid ${C.border}`,padding:"10px 8px"}}>
                <div style={{display:"flex",alignItems:"center",gap:7,padding:"0 6px",marginBottom:12}}>
                  <div style={{width:22,height:22,borderRadius:6,background:"linear-gradient(135deg,#6366F1,#A78BFA)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>🧠</div>
                  <span style={{fontSize:11,fontWeight:700,color:C.text1}}>MeetCopilot</span>
                </div>
                {[["layout-dashboard","Dashboard",false],["calendar-event","Meetings",false],["file-description","Compte Rendu",true],["checkbox","Actions",false],["history","Memory",false]].map(([ic,lb,act])=>(
                  <div key={lb} style={{display:"flex",alignItems:"center",gap:7,padding:"6px 8px",borderRadius:5,marginBottom:2,background:act?C.accentL:"transparent",color:act?C.accent:C.text3,fontSize:10}}>
                    <i className={`ti ti-${ic}`} style={{fontSize:12}}/>{lb}
                  </div>
                ))}
              </div>
              <div style={{flex:1,padding:14,overflowY:"hidden"}}>
                <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:7,marginBottom:12}}>
                  {[[3,C.accent,"Décisions"],[5,C.teal,"Actions"],[2,C.red,"Risques"],[4,C.amber,"Questions"]].map(([n,cl,lb])=>(
                    <div key={lb} style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:6,padding:"8px 10px",textAlign:"center"}}>
                      <div style={{fontSize:18,fontWeight:800,color:cl}}>{n}</div>
                      <div style={{fontSize:7,color:C.text3,textTransform:"uppercase"}}>{lb}</div>
                    </div>
                  ))}
                </div>
                <div style={{background:C.bg3,border:`1px solid ${C.border}`,borderRadius:8,overflow:"hidden"}}>
                  <div style={{padding:"6px 10px",borderBottom:`1px solid ${C.border}`,fontSize:9,fontWeight:600,color:C.text2,display:"flex",alignItems:"center",gap:5}}><i className="ti ti-sparkles" style={{fontSize:10,color:C.accent}}/>Next steps IA <span style={{fontSize:8,color:C.accent,fontWeight:700}}>LIVE · contextualisés</span></div>
                  {[["📄","Rédiger l'ADR Migration Azure","Documenter abandon AWS→Azure, Hub-and-Spoke, middleware X 6 mois","HAUTE",C.red,C.redL],["⚠️","Lever l'incohérence Middleware X","Contradiction avec CR 3 avril (retrait voté). Clarifier avant S28.","HAUTE",C.red,C.redL],["🔌","Valider interfaces SAP avant cut-over","Marie L. deadline 30 mai CRITIQUE — bloquer go-live S27 si non livré.","HAUTE",C.red,C.redL],["📐","Suivre sizing infra (3 réunions ouvert)","Bloqué depuis 5 mai, 20 mai, aujourd'hui. J. Dupont deadline 3 juin.","MOYENNE",C.amber,C.amberL]].map(([ic,title,desc,prio,pc,pb])=>(
                    <div key={title} style={{padding:"7px 10px",borderBottom:`1px solid ${C.border}`,display:"flex",gap:7,alignItems:"flex-start",borderLeft:`2px solid ${pc}`}}>
                      <span style={{fontSize:12,flexShrink:0}}>{ic}</span>
                      <div style={{flex:1}}>
                        <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
                          <span style={{fontSize:9,fontWeight:600,color:C.text1,flex:1}}>{title}</span>
                          <span style={{fontSize:7,fontWeight:700,padding:"1px 4px",borderRadius:2,background:pb,color:pc}}>{prio}</span>
                        </div>
                        <div style={{fontSize:8,color:C.text3,lineHeight:1.4}}>{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{width:160,borderLeft:`1px solid ${C.border}`,padding:"10px 10px",background:C.bg2}}>
                <div style={{fontSize:8,color:C.text3,textTransform:"uppercase",letterSpacing:.6,fontWeight:600,marginBottom:8}}>Meeting Memory</div>
                {[["inconsistency","⚡ Incohérence","Middleware X contradictoire avec CR avril"],["context","🔗 Lié — 12 mars","AWS rejeté. Azure confirme l'orientation."],["recurring","🔁 Récurrent 3×","Sizing infra non clôturé depuis 3 réunions"]].map(m=>(
                  <div key={m[1]} style={{background:mBg(m[0]),border:`1px solid ${mColor(m[0])}22`,borderRadius:6,padding:"6px 8px",marginBottom:6}}>
                    <div style={{fontSize:8,fontWeight:700,color:mColor(m[0]),marginBottom:2}}>{m[1]}</div>
                    <div style={{fontSize:7,color:C.text2,lineHeight:1.4}}>{m[2]}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>

      {/* STATS */}
      <div style={{borderTop:`1px solid ${C.border}`,borderBottom:`1px solid ${C.border}`,display:"grid",gridTemplateColumns:"repeat(4,1fr)",maxWidth:1100,margin:"0 auto"}}>
        {[["400+","équipes IT"],["2.3M","réunions analysées"],["147min","économisées / réunion"],["98%","satisfaction"]].map(([n,l],i)=>(
          <Reveal key={l} style={{padding:"28px 28px",borderRight:i<3?`1px solid ${C.border}`:"none"}}>
            <div className="lp-serif" style={{fontSize:42,fontWeight:900,color:C.text1,letterSpacing:"-2px",lineHeight:1}}>{n}</div>
            <div style={{fontSize:13,color:C.text3,marginTop:5}}>{l}</div>
          </Reveal>
        ))}
      </div>

      {/* HOW IT WORKS */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"90px 24px"}}>
        <Reveal>
          <div style={{fontSize:11,color:C.gold,textTransform:"uppercase",letterSpacing:2,fontWeight:600,marginBottom:12,display:"flex",alignItems:"center",gap:8}}><span style={{width:28,height:1,background:C.gold,display:"inline-block"}}/>Comment ça marche</div>
          <h2 className="lp-serif" style={{fontSize:"clamp(30px,4vw,50px)",fontWeight:900,color:C.text1,letterSpacing:"-1.5px",marginBottom:12}}>De l'audio au compte rendu<br/><em style={{color:"#E8C97A"}}>en 90 secondes.</em></h2>
        </Reveal>
        <Reveal style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:2,marginTop:44,background:C.border,borderRadius:14,overflow:"hidden"}}>
          {steps.map(st=>(
            <div key={st.n} style={{background:C.bg2,padding:"30px 26px",position:"relative",overflow:"hidden"}}>
              <div className="lp-serif" style={{fontSize:80,fontWeight:900,color:"rgba(255,255,255,0.03)",position:"absolute",top:-10,right:14,lineHeight:1,pointerEvents:"none"}}>{st.n}</div>
              <div style={{fontSize:26,marginBottom:14}}>{st.icon}</div>
              <div style={{fontSize:16,fontWeight:600,color:C.text1,marginBottom:7}}>{st.title}</div>
              <div style={{fontSize:13,color:C.text2,lineHeight:1.65,fontWeight:300,marginBottom:14}}>{st.desc}</div>
              <div style={{fontFamily:"monospace",fontSize:10,color:C.text3,background:C.bg4,border:`1px solid ${C.border}`,padding:"4px 10px",borderRadius:4,display:"inline-flex",gap:5}}><i className="ti ti-tag" style={{fontSize:11}}/>{st.tag}</div>
            </div>
          ))}
        </Reveal>
      </div>

      {/* FEATURES */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px 90px"}}>
        <Reveal>
          <div style={{fontSize:11,color:C.gold,textTransform:"uppercase",letterSpacing:2,fontWeight:600,marginBottom:12,display:"flex",alignItems:"center",gap:8}}><span style={{width:28,height:1,background:C.gold,display:"inline-block"}}/>Fonctionnalités</div>
          <h2 className="lp-serif" style={{fontSize:"clamp(30px,4vw,50px)",fontWeight:900,color:C.text1,letterSpacing:"-1.5px"}}>Tout ce dont votre équipe<br/><em style={{color:"#E8C97A"}}>a besoin.</em></h2>
        </Reveal>
        <Reveal style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:2,marginTop:44,background:C.border,borderRadius:14,overflow:"hidden"}}>
          {features.map(f=>(
            <div key={f.title} style={{background:C.bg2,padding:"32px 28px"}}>
              <div style={{fontSize:24,marginBottom:14}}>{f.icon}</div>
              <div style={{fontSize:17,fontWeight:700,color:C.text1,marginBottom:7}}>{f.title}</div>
              <div style={{fontSize:13,color:C.text2,lineHeight:1.7,fontWeight:300,marginBottom:14}}>{f.desc}</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:7}}>{(f.tags||[]).map(t=><span key={t.l} style={{fontSize:11,padding:"4px 10px",borderRadius:5,background:t.bg,color:t.c,fontWeight:500}}>{t.l}</span>)}</div>
            </div>
          ))}
        </Reveal>
      </div>

      {/* PRICING */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px 90px"}}>
        <Reveal style={{textAlign:"center",marginBottom:44}}>
          <h2 className="lp-serif" style={{fontSize:"clamp(30px,4vw,50px)",fontWeight:900,color:C.text1,letterSpacing:"-1.5px"}}>Simple, <em style={{color:"#E8C97A"}}>transparent.</em></h2>
        </Reveal>
        <Reveal style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:2,background:C.border,borderRadius:14,overflow:"hidden"}}>
          {prices.map(p=>(
            <div key={p.label} style={{background:p.featured?"linear-gradient(160deg,rgba(99,102,241,0.12),#0F111A)":C.bg2,padding:"30px 26px",borderTop:p.featured?`2px solid ${C.accent}`:"2px solid transparent"}}>
              {p.featured&&<div style={{fontSize:10,background:C.accentL,color:C.accent,border:`1px solid rgba(99,102,241,0.25)`,padding:"3px 10px",borderRadius:10,fontWeight:600,display:"inline-block",marginBottom:10}}>Le plus populaire</div>}
              <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:1.5,fontWeight:600,color:p.featured?C.accent:C.text3,marginBottom:10}}>{p.label}</div>
              <div className="lp-serif" style={{fontSize:p.amount.length>5?26:46,fontWeight:900,letterSpacing:"-2px",lineHeight:1,color:C.text1,marginBottom:4}}>{p.amount}</div>
              <div style={{fontSize:12,color:C.text3,marginBottom:14}}>{p.period}</div>
              <div style={{fontSize:13,color:C.text2,lineHeight:1.6,marginBottom:18,fontWeight:300}}>{p.desc}</div>
              <div style={{height:1,background:C.border,marginBottom:16}}/>
              {(p.ok||[]).map(f=><div key={f} style={{display:"flex",gap:8,fontSize:12,color:C.text2,marginBottom:7}}><span style={{color:C.green,fontWeight:700}}>✓</span>{f}</div>)}
              {(p.ko||[]).map(f=><div key={f} style={{display:"flex",gap:8,fontSize:12,color:C.text3,marginBottom:7}}><span>–</span>{f}</div>)}
              <button onClick={p.featured?onStart:undefined} style={{display:"block",width:"100%",marginTop:18,fontSize:13,fontWeight:600,padding:"11px",borderRadius:8,cursor:"pointer",border:"none",background:p.featured?"linear-gradient(135deg,#6366F1,#A78BFA)":C.bg3,color:p.featured?"white":C.text1,border:p.featured?"none":`1px solid ${C.border2}`,boxShadow:p.featured?"0 4px 20px rgba(99,102,241,.35)":"none"}}>
                {p.cta}
              </button>
            </div>
          ))}
        </Reveal>
      </div>

      {/* TESTIMONIALS */}
      <div style={{maxWidth:1100,margin:"0 auto",padding:"0 24px 90px"}}>
        <Reveal style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:2,background:C.border,borderRadius:14,overflow:"hidden"}}>
          {testimonials.map(t=>(
            <div key={t.name} style={{background:C.bg2,padding:"26px 22px"}}>
              <div style={{color:"#C9A84C",fontSize:12,letterSpacing:2,marginBottom:11}}>★★★★★</div>
              <div className="lp-serif" style={{fontSize:15,color:C.text1,lineHeight:1.6,marginBottom:14,fontStyle:"italic"}}>"{t.q}"</div>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:32,height:32,borderRadius:"50%",background:t.grad,display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700,color:"white",flexShrink:0}}>{t.av}</div>
                <div>
                  <div style={{fontSize:12,fontWeight:600,color:C.text1}}>{t.name}</div>
                  <div style={{fontSize:10,color:C.text3}}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </Reveal>
      </div>

      {/* CTA FINAL */}
      <div style={{textAlign:"center",padding:"70px 24px 90px",position:"relative"}}>
        <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:500,height:350,borderRadius:"50%",background:"radial-gradient(ellipse,rgba(201,168,76,0.07),transparent 70%)",pointerEvents:"none"}}/>
        <Reveal style={{maxWidth:580,margin:"0 auto",position:"relative"}}>
          <div style={{width:1,height:50,background:`linear-gradient(to bottom,transparent,${C.gold},transparent)`,margin:"0 auto 24px"}}/>
          <h2 className="lp-serif" style={{fontSize:"clamp(32px,4vw,56px)",fontWeight:900,color:C.text1,letterSpacing:"-1.5px",lineHeight:1.1,marginBottom:16}}>Votre prochaine réunion<br/><em style={{color:"#E8C97A"}}>mérite mieux.</em></h2>
          <p style={{fontSize:15,color:C.text2,marginBottom:32,fontWeight:300}}>Rejoignez 400+ équipes IT qui transforment leurs réunions en décisions actionnables.</p>
          <button onClick={onStart} style={{display:"inline-flex",alignItems:"center",gap:8,fontSize:15,fontWeight:700,color:"white",background:"linear-gradient(135deg,#6366F1,#A78BFA)",border:"none",borderRadius:11,padding:"15px 34px",cursor:"pointer",boxShadow:"0 8px 36px rgba(99,102,241,0.45)"}}>
            <i className="ti ti-sparkles" style={{fontSize:16}}/> Commencer gratuitement
          </button>
          <div style={{marginTop:14,fontSize:12,color:C.text3}}>14 jours d'essai gratuit · Sans CB · Annulation à tout moment</div>
        </Reveal>
      </div>

      {/* FOOTER */}
      <div style={{borderTop:`1px solid ${C.border}`,maxWidth:1100,margin:"0 auto",padding:"36px 24px 24px",display:"grid",gridTemplateColumns:"240px 1fr 1fr 1fr",gap:32}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:10}}>
            <div style={{width:26,height:26,borderRadius:7,background:"linear-gradient(135deg,#6366F1,#A78BFA)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>🧠</div>
            <span className="lp-serif" style={{fontSize:15,fontWeight:700,color:C.text1}}>MeetCopilot</span>
          </div>
          <p style={{fontSize:12,color:C.text3,lineHeight:1.7,fontWeight:300}}>L'AI Meeting OS pensé pour les équipes IT.</p>
        </div>
        {[["Produit",["Fonctionnalités","Tarifs","Changelog","Roadmap"]],["Intégrations",["Microsoft Teams","Jira","ServiceNow","Slack"]],["Ressources",["Documentation","Blog","Support","Contact"]]].map(([title,links])=>(
          <div key={title}>
            <div style={{fontSize:10,textTransform:"uppercase",letterSpacing:1.5,color:C.text3,fontWeight:600,marginBottom:10}}>{title}</div>
            {links.map(l=><div key={l} style={{fontSize:12,color:C.text2,marginBottom:7,cursor:"pointer"}}>{l}</div>)}
          </div>
        ))}
      </div>
      <div style={{borderTop:`1px solid ${C.border}`,maxWidth:1100,margin:"0 auto",padding:"14px 24px",display:"flex",justifyContent:"space-between",fontSize:11,color:C.text3}}>
        <span>© 2026 MeetCopilot. Tous droits réservés.</span>
        <div style={{display:"flex",gap:18}}>{["Confidentialité","CGU","Cookies"].map(l=><span key={l} style={{cursor:"pointer"}}>{l}</span>)}</div>
      </div>
    </div>
  );
}
