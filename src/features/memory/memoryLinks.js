import { C } from "../../lib/constants";

export const MEMORY_MEETINGS = [
  { id:"m1", icon:"☁️", color:C.accentL, icolor:C.accent,  name:"Migration Azure — Arbitrage Infra",       date:"25 mai 2026",  decisions:["Migration Azure validée","Hub-and-Spoke retenu","Middleware X maintenu 6 mois"],         actions:["Mapping SAP (Marie L.)","Validation IAM (K. Tran)","Sizing infra (J. Dupont)"], openActions:2, risks:2, systems:["Azure","IAM","SAP","Middleware X"] },
  { id:"m2", icon:"🔒", color:C.amberL,  icolor:C.amber,   name:"IAM & compliance — Audit Q2",            date:"22 mai 2026",  decisions:["Middleware X : retrait confirmé (compliance)","Audit Q2 planifié"],                  actions:["Mise à jour politique IAM","Rapport compliance DSI"],                            openActions:1, risks:4, systems:["IAM","Middleware X","Azure AD"] },
  { id:"m3", icon:"🔗", color:C.tealL,   icolor:C.teal,    name:"Design review — API Gateway v2",         date:"24 mai 2026",  decisions:["API Gateway v2 adopté","Authentification OAuth2 retenue"],                         actions:["Validation routes (K. Tran)","Tests de charge"],                                 openActions:2, risks:1, systems:["API Gateway","IAM","Azure"] },
  { id:"m4", icon:"📊", color:C.purpleL, icolor:C.purple,  name:"Data Platform — Revue architecture",     date:"20 mai 2026",  decisions:["Kafka retenu comme bus d'événements","Migration Spark 3.5"],                       actions:["Sizing Kafka (J. Dupont)","POC Spark (équipe Data)"],                            openActions:2, risks:2, systems:["Kafka","Data Platform","Azure"] },
  { id:"m5", icon:"⚡", color:C.redL,    icolor:C.red,     name:"Kafka performance — Point de suivi",     date:"15 avr 2026",  decisions:["Action créée : investigation perf Kafka"],                                         actions:["Analyse bottleneck (non clôturée)"],                                             openActions:1, risks:1, systems:["Kafka","Middleware"] },
  { id:"m6", icon:"🔴", color:C.redL,    icolor:C.red,     name:"Kafka performance — 1ère occurrence",   date:"8 avr 2026",   decisions:["Sujet Kafka soulevé sans décision"],                                               actions:[],                                                                                openActions:0, risks:1, systems:["Kafka"] },
  { id:"m7", icon:"🏗", color:C.accentL, icolor:C.accent,  name:"Architecture SI — Revue mensuelle",      date:"3 avr 2026",   decisions:["Middleware X : retrait voté (compliance RGPD)","Roadmap SI validée Q2"],           actions:["Plan de sortie Middleware X","Mise à jour cartographie SI"],                     openActions:0, risks:1, systems:["Middleware X","ERP","IAM"] },
  { id:"m8", icon:"☁️", color:C.bg3,    icolor:C.text3,   name:"Infrastructure cloud — Arbitrage",       date:"12 mars 2026", decisions:["AWS rejeté pour coûts","Azure retenu comme direction"],                           actions:["Étude TCO Azure (Marie L. — livrée)"],                                          openActions:0, risks:0, systems:["Azure","AWS","Cloud"] },
];

export const MEMORY_LINKS = [
  { type:"inconsistency", from:"m1", to:"m7",  label:"Contradiction Middleware X",      text:"Maintenu le 25 mai ≠ retrait voté le 3 avril. Décision inversée sans ADR formel.", priority:"HAUTE" },
  { type:"context",       from:"m1", to:"m8",  label:"Confirmation Azure",              text:"La validation Azure du 25 mai confirme l'orientation du 12 mars. AWS définitivement écarté.", priority:"INFO" },
  { type:"recurring",     from:"m4", to:"m5",  label:"Kafka non résolu (3×)",           text:"Kafka performance évoqué sans résolution en avril, mai et maintenant juin. Dette technique latente.", priority:"HAUTE" },
  { type:"open",          from:"m1", to:"m4",  label:"Sizing infra lié Kafka + Azure",  text:"Le sizing (J. Dupont · 3 juin) dépend à la fois de la décision Azure et de l'architecture Kafka.", priority:"MOYENNE" },
  { type:"context",       from:"m1", to:"m3",  label:"Impact API Gateway",              text:"L'API Gateway v2 doit être revalidée post-migration Azure — routes et authentification à confirmer.", priority:"MOYENNE" },
  { type:"inconsistency", from:"m2", to:"m7",  label:"Double vote Middleware X",        text:"Retrait voté deux fois (3 avril + 22 mai). Compliance jamais résolue malgré deux décisions formelles.", priority:"HAUTE" },
];

export const MEMORY_AI_PROMPT = `Tu es MeetCopilot, expert en analyse de réunions IT. Voici l'historique des réunions et les liens contextuels detectes.

REUNIONS :
${MEMORY_MEETINGS.map(m=>`- ${m.date} : ${m.name} | Decisions: ${m.decisions.slice(0,2).join("; ")}`).join("\n")}

LIENS :
${MEMORY_LINKS.map(l=>`- [${l.type.toUpperCase()}] ${l.label}: ${l.text}`).join("\n")}

Genere un rapport JSON valide sans markdown :
{"synthesis":"2-3 phrases sur les patterns critiques","hotTopics":[{"topic":"sujet","count":N,"meetings":["noms courts"],"risk":"ÉLEVÉ|MOYEN","action":"action recommandée"}],"criticalInconsistencies":[{"title":"titre","detail":"explication","meetings":["noms"],"recommendation":"que faire"}],"openActionsAtRisk":[{"action":"texte","owner":"qui","dueDate":"date","blockedBy":"raison"}],"sinceLastMeeting":{"completed":["action"],"overdue":["retard"],"newRisks":["risque"]}}`;
