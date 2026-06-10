export const C = {
  bg:"#09090F", bg2:"#0F111A", bg3:"#161928", bg4:"#1E2137",
  border:"rgba(255,255,255,0.06)", border2:"rgba(255,255,255,0.11)",
  text1:"#ECEDF8", text2:"#8C91AD", text3:"#464C6A",
  accent:"#6366F1", accentL:"rgba(99,102,241,0.14)",
  purple:"#A78BFA", purpleL:"rgba(167,139,250,0.12)",
  teal:"#2DD4BF", tealL:"rgba(45,212,191,0.12)",
  green:"#34D399", greenL:"rgba(52,211,153,0.12)",
  amber:"#FBBF24", amberL:"rgba(251,191,36,0.12)",
  red:"#F87171", redL:"rgba(248,113,113,0.12)",
  pink:"#F472B6", gold:"#C9A84C", gold2:"#E8C97A",
};

export const ROLES = [
  { id:"architect", icon:"🏗", label:"Architect",        color:C.accent,  grad:"linear-gradient(135deg,#6366F1,#818CF8)", tagline:"Vue technique & systèmes", focus:["Impacts architecture","Dépendances SI","Risques techniques","Décisions de design"] },
  { id:"pm",        icon:"📋", label:"Project Manager",  color:C.teal,    grad:"linear-gradient(135deg,#2DD4BF,#06B6D4)", tagline:"Delivery, échéances & ownership", focus:["Actions & owners","Milestones & deadlines","Blocages & dépendances","RAID log"] },
  { id:"po",        icon:"🎯", label:"Product Owner",    color:C.pink,    grad:"linear-gradient(135deg,#F472B6,#EC4899)", tagline:"Valeur produit & backlog", focus:["Décisions produit","Impact utilisateurs","Stories & epics","Priorisation"] },
  { id:"delivery",  icon:"🚀", label:"Delivery Lead",    color:C.green,   grad:"linear-gradient(135deg,#34D399,#10B981)", tagline:"Exécution & vélocité", focus:["Avancement sprints","Vélocité & capacité","Obstacles","Qualité livraisons"] },
  { id:"security",  icon:"🔒", label:"Security",         color:C.amber,   grad:"linear-gradient(135deg,#FBBF24,#F59E0B)", tagline:"Compliance, IAM & risques", focus:["IAM & accès","Compliance & audit","Exposition risque","Vulnérabilités"] },
  { id:"itmanager", icon:"⚙️", label:"IT Manager",       color:C.purple,  grad:"linear-gradient(135deg,#A78BFA,#7C3AED)", tagline:"Gouvernance & budget IT", focus:["Budget & ressources","Gouvernance IT","Performances équipes","Décisions stratégiques"] },
];

export const PAST_MEETINGS_CONTEXT = `Réunions précédentes (contexte Meeting Memory) :
- 12 mars 2026 : AWS envisagé mais rejeté (coûts). Azure mentionné comme alternative.
- 3 avril 2026 : Retrait du middleware X voté à l'unanimité pour raisons de compliance RGPD.
- 8 avril 2026 : Kafka performance issue évoqué sans résolution (1ère occurrence).
- 15 avril 2026 : Kafka performance issue à nouveau mentionné, action créée non clôturée.
- 5 mai 2026 : Kafka performance issue toujours ouvert. Sizing infra évoqué sans décision.
- 20 mai 2026 : Sizing infra toujours non clôturé. IAM validation bloquante pour le go-live.`;

export const DEMO_TRANSCRIPT = `Réunion : Migration Azure — Arbitrage Infra
Date : 25 mai 2026, 14h00-15h30
Participants : Jean Dupont (Architecte), Marie Laurent (Infra Lead), Kevin Tran (IAM), Lucie Bernard (PM)

[14:02] Jean Dupont : Aujourd'hui on tranche définitivement sur Azure versus AWS.
[14:05] Marie Laurent : Sur 3 ans, Azure coûte 34% moins cher grâce à notre licence M365.
[14:08] Kevin Tran : L'intégration Azure AD est meilleure. Je dois valider les groupes AD avant d'avancer.
[14:12] Jean Dupont : On valide la migration Azure. AWS abandonné définitivement pour ce cycle.
[14:13] Lucie Bernard : Attention, notre contrat AWS court jusqu'en S30. Vérifier les pénalités avec le juridique.
[14:15] Jean Dupont : Pour la topologie réseau, je recommande Hub-and-Spoke. Marie gère le firewall central.
[14:20] Sofiane Merah : Le middleware X — on avait voté son retrait en avril pour compliance.
[14:22] Jean Dupont : On le maintient 6 mois le temps de la migration. Plan de sortie en S28.
[14:25] Lucie Bernard : Marie, mapping SAP-Azure avant le 30 mai ? Critique pour le go-live S27.
[14:26] Marie Laurent : Je m'en charge.
[14:28] Kevin Tran : Je valide le modèle IAM pour le 31 mai.
[14:30] Jean Dupont : Je fais le sizing infra pour le 3 juin et l'ADR d'ici le 27 mai.
[14:35] Camille Roy : Qui sera Cloud Owner du tenant Azure ? Le budget opex a-t-il été revalidé ?
[14:36] Jean Dupont : Pas tranché aujourd'hui. On verra en S22 avec le DSI.
[14:40] Lucie Bernard : Stratégie DR — le RTO sur Azure a-t-il été revalidé ?
[14:45] Jean Dupont : Non, à faire. On se retrouve en S27 pour le go-live review.`;

export const DEMO_RESULT = {
  name:"Migration Azure — Arbitrage Infra",
  date:"25 mai 2026 · 14h00–15h30 · 6 participants",
  summary:"La réunion a validé définitivement la migration vers Azure en remplacement d'AWS, avec une économie de 34% sur 3 ans. Cinq actions critiques ont été assignées avant le go-live S27. Deux risques majeurs nécessitent un suivi immédiat.",
  decisions:[
    {id:1,text:"Migration validée vers Azure (abandon AWS)",context:"Économie 34% sur 3 ans, alignement M365. Décision irréversible pour ce cycle."},
    {id:2,text:"Architecture Hub-and-Spoke retenue",context:"Firewall central géré par Infra. Spokes déployés par domaine métier."},
    {id:3,text:"Middleware X maintenu temporairement 6 mois",context:"Plan de sortie défini en S28. Décision contredit le vote du 3 avril."},
  ],
  actions:[
    {text:"Vérifier le mapping SAP ↔ Azure",owner:"Marie L.",deadline:"30 mai",priority:"CRITIQUE"},
    {text:"Valider le modèle IAM Azure AD",owner:"K. Tran",deadline:"31 mai",priority:"CRITIQUE"},
    {text:"Sizing infra (compute, storage, network)",owner:"J. Dupont",deadline:"3 juin",priority:"ÉLEVÉ"},
    {text:"Rédiger l'ADR de migration",owner:"J. Dupont",deadline:"27 mai",priority:"ÉLEVÉ"},
    {text:"Planifier l'Architecture Review post-migration",owner:"L. Bernard",deadline:"10 juin",priority:"NORMAL"},
  ],
  risks:[
    {text:"Dépendance contractuelle AWS jusqu'en S30",level:"ÉLEVÉ",detail:"Pénalités de sortie anticipée — validation juridique requise avant tout cut-over."},
    {text:"Dette technique Middleware X vs compliance",level:"ÉLEVÉ",detail:"Conflit avec décision du 3 avril — à tracer dans le registre des risques."},
  ],
  openQuestions:[
    "Gouvernance du tenant Azure : qui est le Cloud Owner ?",
    "Budget opex post-migration confirmé à 34% d'économie ?",
    "Plan de sortie Middleware X — quel owner pour S28 ?",
    "Stratégie DR — RTO sur Azure revalidé avec le métier ?",
  ],
  systems:[
    {name:"Azure / Cloud",impact:"CRITIQUE"},{name:"IAM / Azure AD",impact:"CRITIQUE"},
    {name:"ERP / SAP",impact:"ÉLEVÉ"},{name:"API Gateway",impact:"ÉLEVÉ"},
    {name:"Middleware X",impact:"MOYEN"},{name:"Infra / Network",impact:"MOYEN"},
  ],
  memory:[
    {type:"inconsistency",label:"Incohérence détectée",text:"Middleware X maintenu (aujourd'hui) ≠ retrait voté (CR 3 avril)"},
    {type:"context",label:"Contexte lié — 12 mars",text:"AWS rejeté pour coûts. La décision Azure confirme l'orientation."},
    {type:"recurring",label:"Récurrent (3 réunions)",text:"Sizing infra non clôturé — risque blocage go-live S27."},
  ],
};
