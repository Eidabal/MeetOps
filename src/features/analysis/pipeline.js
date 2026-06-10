import { C } from "../../lib/constants";

export const ANALYSIS_STEPS = [
  {id:"transcribe",icon:"waveform",   label:"Transcription audio",       color:C.accent},
  {id:"parse",     icon:"brain",      label:"Analyse sémantique IA",     color:C.purple},
  {id:"decisions", icon:"gavel",      label:"Extraction des décisions",  color:C.teal},
  {id:"actions",   icon:"checkbox",   label:"Détection des actions",     color:C.green},
  {id:"risks",     icon:"alert-triangle",label:"Identification des risques",color:C.red},
  {id:"systems",   icon:"topology-star",label:"Cartographie des systèmes",color:C.amber},
  {id:"cr",        icon:"file-description",label:"Génération du CR",     color:C.accent},
];

export const STEP_LOGS = {
  transcribe: ["Chargement de la transcription…","Découpage en segments de 30s…","Diarisation des locuteurs…","Locuteurs identifiés ✓","Nettoyage du corpus…","Transcription prête ✓"],
  parse:      ["Pipeline NLP initialisé…","Tokenisation du corpus…","Embeddings sémantiques générés ✓","Classification des énoncés…","Analyse des intentions…","Entités nommées extraites ✓"],
  decisions:  ["Recherche de patterns de décision…","Scoring des candidats…","Validation contextuelle…","Décisions extraites ✓"],
  actions:    ["Détection d'engagement linguistique…","Extraction des owners…","Parsing des deadlines…","Actions assignées ✓"],
  risks:      ["Analyse des signaux d'incertitude…","Classification des risques…","Évaluation de la criticité…","Risques identifiés ✓"],
  systems:    ["Extraction des entités SI…","Détection des domaines impactés…","Cartographie des dépendances…","Systèmes cartographiés ✓"],
  cr:         ["Structuration du compte rendu…","Génération du résumé exécutif…","Mise en forme finale…","Streaming du CR…"],
};
