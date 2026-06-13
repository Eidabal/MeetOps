# CLAUDE.md — MeetOps · AI Meeting OS

Ce fichier décrit le projet, l'architecture, les conventions et les règles de développement pour Claude Code et tout agent IA travaillant sur ce repo.

> **Convention de lecture** : ce document distingue l'**état actuel** du code (ce qui existe) de l'**état cible** (ce vers quoi on va). Là où les deux divergent, c'est signalé explicitement par une note `> 🎯 Cible` ou un marqueur `(planifié)`. Ne jamais supposer qu'une règle « cible » reflète déjà le code.

---

## Vue d'ensemble du projet

**MeetOps** est un SaaS B2B d'analyse de réunions IT propulsé par l'IA.

Il transforme automatiquement des transcriptions de réunions en comptes rendus structurés, actions assignées, risques détectés et next steps contextualisés — le tout adapté au rôle de l'utilisateur (Architect, PM, Security, PO, Delivery Lead, IT Manager).

### Features principales (MVP)

| Feature | Statut |
|---|---|
| Upload transcription / audio | ✅ |
| Analyse IA live (Claude Sonnet) | ✅ |
| Compte Rendu structuré (CR) | ✅ |
| Vue par rôle | ✅ |
| Next steps IA contextualisés | ✅ |
| Meeting Memory (liens entre réunions) | ✅ |
| Analytics KPIs & Tendances | ✅ |
| Persistance Supabase | 🔧 hook `useMeetings` + migration produits, intégration `App.jsx` à finaliser |
| Auth & multi-tenant | 🔲 |
| Appels IA côté serveur (Edge Functions) | 🔲 appel direct client (sandbox only) — tous les appels passent désormais par `lib/anthropic.js`, prêt à brancher sur une Edge Function |
| Migration Tailwind | 🔧 Tailwind configuré (tokens `C` mappés dans le thème) ; shell + page Meetings convertis, ~664/708 blocs inline restants |
| Transcription audio réelle (Whisper) | 🔲 |
| Export Word / Jira / Teams | 🔲 |

**Légende** : ✅ fait · 🔧 en cours · 🔲 à faire

---

## Stack technique

```
Frontend     React 18 + Vite 5
Langage      JavaScript (JSX) — pas de TypeScript pour l'instant
Styling      Tailwind CSS (configuré) + inline pour valeurs dynamiques  —  migration en cours
Animations   Framer Motion (planifié)
Charts       composants maison (MiniBarChart, Sparkline, DonutChart)  →  🎯 cible : Recharts / Tremor
Auth         Supabase Auth (planifié)
Database     Supabase (PostgreSQL + RLS)
Storage      Supabase Storage (fichiers audio, planifié)
Backend      Supabase Edge Functions (Deno)  →  🎯 cible (appels IA actuellement côté client)
AI           Anthropic Claude — claude-sonnet-4-20250514
Transcription Whisper API (OpenAI) ou Deepgram (planifié)
Deploy       Vercel (frontend) + Supabase (backend)
```

> ⚠️ La distinction langage est importante : le code est en **JavaScript/JSX**. Les règles de typage (ex. interdiction de `any`) ne s'appliquent que si/quand une migration TypeScript est décidée.

---

## Commandes

### Frontend (Vite)

```bash
npm install          # installer les dépendances
npm run dev          # serveur de dev (http://localhost:5173)
npm run build        # build de production (doit toujours passer avant un merge)
npm run preview      # prévisualiser le build
```

> ⚠️ `npm run build` est le filet de sécurité actuel : aucun lint ni test automatisé n'est encore configuré. **Toujours vérifier que le build passe** avant de livrer.

### Outillage à mettre en place (planifié)

```bash
# Lint  — ESLint à configurer
npm run lint
# Tests — Vitest + React Testing Library à configurer
npm run test
```

### Supabase (backend / edge functions)

```bash
supabase start                                              # DB Postgres locale (Docker), localhost:54322
supabase functions serve analyze-meeting --env-file .env.local
supabase db reset                                           # rejoue les migrations en local
```

---

## Structure du projet

État réel du repo. Les entrées marquées `(planifié)` sont décrites par cette doc mais **pas encore présentes** dans le code.

```
meetops/
├── CLAUDE.md                    # Ce fichier
├── .env.local                   # Variables d'environnement (NE JAMAIS COMMITTER)
├── .env.example                 # Template des variables
├── .gitignore
├── package.json · vite.config.js · index.html
├── tailwind.config.js · postcss.config.js   # Tailwind : tokens C mappés dans le thème + dégradés brand/brand2
│
├── src/
│   ├── main.jsx                 # point d'entrée, charge globals.css
│   ├── App.jsx                  # routeur + state global (role, page, activeCR, meetingsList)
│   │
│   ├── components/
│   │   ├── ui/                  # Badge · Btn · Particles · Reveal
│   │   ├── layout/              # Sidebar · Topbar
│   │   ├── charts/              # MiniBarChart · Sparkline · DonutChart
│   │   └── memory/              # MemoryGraph  (MemoryAlerts : planifié)
│   │
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Onboarding.jsx       # écran d'onboarding (hors liste initiale, conservé du monolithe)
│   │   ├── Dashboard.jsx
│   │   ├── Upload.jsx           # flow d'import + analyse live
│   │   ├── CR.jsx               # Compte Rendu + panneau droit
│   │   ├── Meetings.jsx
│   │   ├── Memory.jsx
│   │   └── Analytics.jsx
│   │
│   ├── features/
│   │   ├── analysis/
│   │   │   ├── pipeline.js      # étapes d'analyse simulées (7 étapes)
│   │   │   ├── prompts.js       # TOUS les prompts Claude (buildAnalysisPrompt)
│   │   │   └── parser.js        # parse et valide le JSON retourné par Claude
│   │   ├── nextSteps/
│   │   │   └── NextStepsPanel.jsx
│   │   └── memory/
│   │       └── memoryLinks.js   # logique de détection des liens
│   │
│   ├── hooks/
│   │   ├── useAnalysis.js       # hook principal d'analyse (pipeline + streaming + parsing)
│   │   ├── useMeetings.js       # CRUD réunions : Supabase → localStorage → state (optimistic)
│   │   └── useAuth.js           # auth state (planifié)
│   │
│   ├── lib/
│   │   ├── constants.js         # C (design tokens), ROLES, données démo (PAST_MEETINGS_CONTEXT, DEMO_TRANSCRIPT, DEMO_RESULT)
│   │   ├── format.js            # helpers d'affichage (pColor, pBg, mColor, mBg, mIcon)
│   │   ├── supabase.js          # client Supabase (singleton)
│   │   └── anthropic.js         # callClaude / streamClaude (→ via edge functions en prod)
│   │
│   └── styles/
│       └── globals.css          # directives @tailwind + polices + keyframes + fix police d'icônes ti ti-*
│
├── supabase/
│   ├── migrations/              # SQL migrations (001_init_meetings.sql)
│   ├── functions/               # (planifié)
│   │   ├── analyze-meeting/     # Edge function : appel Claude en streaming
│   │   ├── transcribe-audio/    # Edge function : appel Whisper
│   │   └── generate-nextsteps/  # Edge function : next steps IA
│   └── seed.sql                 # données de démo (planifié)
│
└── public/
```

> 🎯 **Cible structurelle** : créer `hooks/useAuth.js`, `components/memory/MemoryAlerts.jsx` et le dossier `supabase/functions/` lorsque les features correspondantes seront attaquées.

---

## Variables d'environnement

```bash
# .env.local — NE JAMAIS COMMITTER

# Supabase (client-safe)
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...

# Anthropic (UNIQUEMENT côté serveur / edge functions — jamais dans le client)
ANTHROPIC_API_KEY=sk-ant-...

# OpenAI Whisper (transcription audio)
OPENAI_API_KEY=sk-...

# Optionnel
VITE_APP_ENV=development
```

> ⚠️ La clé `ANTHROPIC_API_KEY` ne doit **jamais** être exposée côté client (pas de préfixe `VITE_`). En cible, tous les appels Claude passent par les Supabase Edge Functions.
> ⚠️ **État actuel** : l'app appelle l'API Anthropic directement depuis le client (fonctionne uniquement dans le bac à sable d'artifact). Le passage en edge function est une priorité non encore implémentée — voir « Priorités actuelles ».

---

## Schéma de base de données

```sql
-- Utilisateurs (géré par Supabase Auth) — table publique profiles liée à auth.users
profiles
  id          uuid references auth.users
  role        text  -- architect | pm | po | delivery | security | itmanager
  prefs       jsonb -- { lang, memory, nextSteps, alerts, integrations }
  created_at  timestamptz

-- Réunions analysées
meetings
  id          uuid
  user_id     uuid references profiles
  name        text
  date        date
  transcript  text       -- transcription brute
  audio_path  text       -- path Supabase Storage (nullable)
  status      text       -- pending | analyzing | done | error
  created_at  timestamptz

-- Comptes rendus générés
meeting_results
  id           uuid
  meeting_id   uuid references meetings
  summary      text
  decisions    jsonb   -- [{ id, text, context }]
  actions      jsonb   -- [{ text, owner, deadline, priority }]
  risks        jsonb   -- [{ text, level, detail }]
  open_questions jsonb -- [string]
  systems      jsonb   -- [{ name, impact }]
  memory_links jsonb   -- [{ type, label, text }]
  tokens_used  int
  model        text
  created_at   timestamptz

-- Memory links entre réunions
memory_links
  id           uuid
  user_id      uuid references profiles
  from_meeting uuid references meetings
  to_meeting   uuid references meetings
  type         text  -- inconsistency | context | recurring | open
  label        text
  text         text
  priority     text  -- HAUTE | MOYENNE | INFO
  created_at   timestamptz
```

**Row Level Security (RLS) — règle absolue**

Chaque table a RLS activé. Un user ne voit que ses propres données :

```sql
alter table meetings enable row level security;
create policy "users see own meetings"
  on meetings for all
  using (auth.uid() = user_id);
```

---

## Architecture des appels IA

### Principe fondamental (cible)

```
Client (React)
    │  POST /functions/v1/analyze-meeting   { transcript, pastContext, role }
    ▼
Supabase Edge Function (Deno)
    │  fetch("https://api.anthropic.com/v1/messages", { stream: true })
    │  Authorization: Bearer ANTHROPIC_API_KEY   ← jamais exposé au client
    ▼
Claude claude-sonnet-4-20250514
    │  SSE streaming → retransmis au client
    ▼
Client reçoit les chunks et affiche le JSON en live
```

> ⚠️ **État actuel** : l'appel part directement du client vers `api.anthropic.com` (fonctionne uniquement dans le bac à sable d'artifact). `lib/anthropic.js` (`callClaude` / `streamClaude`) est le point de centralisation prévu — c'est là qu'on branchera l'edge function.
> ✅ **Centralisation complète** : tous les appels Anthropic (`useAnalysis` via `streamClaude`, `NextStepsPanel` et `Memory.jsx` via `callClaude`) passent par `lib/anthropic.js`. C'est le point unique où brancher l'Edge Function. Ne **jamais** réintroduire de `fetch` Anthropic inline ailleurs.

### Modèle utilisé

Toujours `claude-sonnet-4-20250514`. Ne pas utiliser Haiku (qualité insuffisante pour l'extraction) ni Opus (trop lent pour le streaming live). Tout changement de modèle nécessite une validation explicite.

### Prompts — règles

Tous les prompts vivent dans `src/features/analysis/prompts.js`. **Jamais de prompt inline dans un composant.**

Chaque prompt doit :
- Demander un JSON valide **sans markdown** (pas de backticks, pas de texte avant/après)
- Inclure un exemple de structure attendue
- Gérer les cas où la transcription est courte ou vide
- Être testé avec `supabase functions serve` avant de merger (une fois les edge functions en place)

---

## Conventions de code

### Nommage

```js
function NextStepsPanel() {}          // Composants : PascalCase
function useAnalysis() {}             // Hooks : camelCase préfixé use
const ROLES = [...]                   // Constants globales : SCREAMING_SNAKE
const DEMO_RESULT = {...}
const handleFileUpload = () => {}     // Handlers : handle + action
```

### State management

- Pas de Redux ni Zustand pour l'instant — `useState` + props drilling suffit.
- Le state global (`meetingsList`, `activeCR`, `role`, `page`) vit dans `App.jsx`.
- La persistance des réunions passe par le hook `useMeetings` (jamais d'appel Supabase direct dans un composant).
- Si le props drilling dépasse 3 niveaux, créer un Context.

### Styling

> 🔧 **État actuel** : migration Tailwind **lancée et configurée**. `tailwind.config.js` mappe les tokens `C` dans le thème (`C.bg2` → `bg-bg2`, `C.accentL` → `bg-accentL`, `border-border`…), plus les dégradés récurrents en `bg-brand` / `bg-brand2`, les polices et keyframes. Approche **hybride assumée** : le structurel statique passe en classes utilitaires, les valeurs calculées au runtime restent en `style` inline.
>
> **Convertis** : `App.jsx`, `components/ui/Btn`, `components/ui/Badge`, `components/layout/Sidebar`, `components/layout/Topbar`, `pages/Meetings.jsx`.
> **Restants (~664 blocs)** : pages `Landing`, `Memory`, `Analytics`, `Upload`, `Onboarding`, `CR`, `Dashboard` ; `features/nextSteps/NextStepsPanel` ; `components/charts/*` ; `components/memory/MemoryGraph`.

- Le design system est défini dans `src/lib/constants.js` et reflété dans `tailwind.config.js` (toute nouvelle couleur doit exister aux deux endroits) :

```js
export const C = { bg: "#09090F", accent: "#6366F1", /* ... */ }
```

> 🎯 **Règle de migration** : convertir le statique en classes Tailwind ; n'utiliser l'inline `style={{}}` que pour les valeurs dynamiques (couleurs de rôle/état calculées, dégradés conditionnels, dimensions JS). Pour un fichier non encore migré, rester cohérent avec l'existant (inline + tokens `C`) plutôt que de mélanger à moitié.

### Composants

- Un composant = un fichier.
- Props destructurées avec valeurs par défaut.
- **Toujours défensif sur les tableaux** issus de l'IA :

```js
(result.decisions || []).map(d => ...)   // ✅ Correct
result.decisions.map(d => ...)           // ❌ Dangereux
```

---

## Flows critiques à ne pas casser

### 1. Flow d'analyse

```
Upload.jsx → useAnalysis()
  → runPipeline()             -- 7 étapes simulées en parallèle de l'appel IA
  → streamClaude()            -- lib/anthropic.js (→ edge function en cible)
  → parser.js                 -- parse + valide le JSON
  → setMeetingResult(parsed)  -- App.jsx handleMeetingResult()
  → navigation vers CR
```

Le résultat parsé doit toujours avoir cette structure minimale :
```js
{ name, date, summary, decisions: [], actions: [], risks: [], openQuestions: [], systems: [], memory: [] }
```

Si le JSON retourné par Claude est invalide → fallback sur `DEMO_RESULT`.

### 2. Persistance des réunions

```
handleMeetingResult(result)
  → useMeetings : optimistic update du state
  → écriture localStorage (cache offline)
  → écriture Supabase meetings + meeting_results (si dispo)
  → met à jour activeCR
```

> Stratégie 3 couches : **Supabase → localStorage → state mémoire**. Toujours préserver le repli localStorage pour le mode offline / sandbox.

### 3. Next steps IA

`NextStepsPanel` se régénère quand `result.name` ou `role` change. Il ne doit **pas** appeler l'API si `result` est null, et passe par `lib/anthropic.js` (pas de fetch inline).

---

## Workflow Git

- Remote : `origin` → https://github.com/Eidabal/MeetOps (branche par défaut `main`).
- `main` = branche stable, toujours buildable. Travailler sur des branches `feat/...`, `fix/...`, `refactor/...`.
- **Commits conventionnels** : `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`.
  - ex. `feat: persistance Supabase meetings (hook useMeetings + migration SQL)`
- **Avant tout commit** : `npm run build` doit passer.
- `.gitignore` doit couvrir au minimum :
  ```
  node_modules
  dist
  .env
  .env.local
  *.local
  .DS_Store
  ```
- **Ne jamais committer** `.env.local` ni aucune clé. Seul `.env.example` (template vide) est versionné.

---

## Tests

> ⚠️ **État actuel** : aucun test automatisé. La validation se fait via `npm run build` (intégrité du graphe de modules) et test manuel des edge functions via `supabase functions serve`.

> 🎯 **Cible** : introduire **Vitest + React Testing Library**. Priorité de couverture :
> 1. `parser.js` — parsing/validation du JSON IA (cas valides, invalides, partiels)
> 2. `useAnalysis` — pipeline + fallback `DEMO_RESULT`
> 3. `useMeetings` — repli localStorage quand Supabase est indisponible

---

## Ce que Claude Code ne doit PAS faire

- ❌ Exposer `ANTHROPIC_API_KEY` côté client (pas de `VITE_ANTHROPIC_API_KEY`)
- ❌ Écrire des prompts inline dans les composants — tout dans `prompts.js`
- ❌ Réintroduire un `fetch` Anthropic ailleurs que dans `lib/anthropic.js`
- ❌ Faire des appels Supabase directement dans les composants — passer par les hooks
- ❌ Committer `.env.local` ou une clé
- ❌ Changer le modèle Claude sans validation — toujours `claude-sonnet-4-20250514`
- ❌ Supprimer les fallbacks `|| []` sur les tableaux du résultat IA
- ❌ Modifier le schéma SQL sans ajouter une migration dans `supabase/migrations/`
- ❌ Mettre une valeur **dynamique** (couleur calculée, dégradé conditionnel) dans une classe Tailwind — elle reste en `style` inline ; inversement, ne pas laisser du structurel statique en inline dans un fichier déjà migré
- ❌ Merger sans que `npm run build` passe

## Ce que Claude Code DOIT faire

- ✅ Toujours tester le parsing JSON avant d'utiliser le résultat Claude
- ✅ Implémenter un fallback sur `DEMO_RESULT` si l'API échoue
- ✅ Appliquer RLS sur toutes les nouvelles tables Supabase
- ✅ Garder les prompts dans `src/features/analysis/prompts.js`
- ✅ Passer tous les appels IA par `lib/anthropic.js` et tous les accès données par les hooks
- ✅ Documenter les nouvelles edge functions avec un commentaire de type JSDoc
- ✅ Préserver la programmation défensive sur les tableaux IA (`|| []`)
- ✅ Vérifier l'état des fichiers existants avant de lancer un script de génération (un refactor antérieur a déjà été écrasé par un script — toujours auditer avant d'écrire)
- ✅ Mettre à jour ce fichier `CLAUDE.md` quand l'architecture **ou l'état réel** change

---

## Rôles disponibles

```js
const ROLES = [
  { id: "architect",  label: "Architect",       focus: ["Impacts architecture", "Dépendances SI", "Risques techniques"] },
  { id: "pm",         label: "Project Manager",  focus: ["Actions & owners", "Milestones", "RAID log"] },
  { id: "po",         label: "Product Owner",    focus: ["Décisions produit", "Stories & epics", "Priorisation"] },
  { id: "delivery",   label: "Delivery Lead",    focus: ["Avancement sprints", "Vélocité", "Obstacles"] },
  { id: "security",   label: "Security",         focus: ["IAM & accès", "Compliance", "Exposition risque"] },
  { id: "itmanager",  label: "IT Manager",       focus: ["Budget", "Gouvernance IT", "KPIs équipes"] },
]
```

Les next steps IA et le focus du CR sont toujours filtrés par ce rôle.

---

## Priorités actuelles (prochaines sessions)

1. **Finaliser la persistance** — câbler `useMeetings` dans `App.jsx`, recharger les réunions + CRs au login
2. **Edge Functions** — déplacer les appels Anthropic côté serveur (brancher `lib/anthropic.js` sur `analyze-meeting`)
3. **Auth Supabase** — login / signup, sessions persistantes, hook `useAuth`
4. **Poursuivre la migration Tailwind** — convertir les pages restantes (ordre suggéré : Dashboard → CR → Onboarding, puis Upload, Analytics, Memory) ; sans risque, peut se faire en parallèle
5. **Whisper** — vraie transcription audio via edge function
6. **Export Word** — `.docx` téléchargeable depuis le CR
7. **Export Jira** — créer des tickets depuis les actions du CR

---

## Références

- [Anthropic API Docs](https://docs.anthropic.com)
- [Supabase Docs](https://supabase.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Vite + React](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vitest](https://vitest.dev)
