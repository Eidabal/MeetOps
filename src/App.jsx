import { useState } from "react";
import { C } from "./lib/constants";
import { Sidebar } from "./components/layout/Sidebar";
import { LandingPage } from "./pages/Landing";
import { Onboarding } from "./pages/Onboarding";
import { PageDashboard } from "./pages/Dashboard";
import { PageUpload } from "./pages/Upload";
import { PageCR } from "./pages/CR";
import { PageMeetings } from "./pages/Meetings";
import { PageMemory } from "./pages/Memory";
import { PageAnalytics } from "./pages/Analytics";

export default function App() {
  const [screen,       setScreen]       = useState("landing");
  const [role,         setRole]         = useState("architect");
  const [page,         setPage]         = useState("dashboard");
  const [activeCR,     setActiveCR]     = useState(null);   // CR actuellement affiché
  const [meetingsList, setMeetingsList] = useState([]);     // réunions analysées (en mémoire)

  const handleOnboardDone = (selectedRole) => {
    setRole(selectedRole || "architect");
    setScreen("app");
    setPage("dashboard");
  };

  // Appelé par PageUpload quand l'analyse est terminée.
  const handleMeetingResult = (result) => {
    const entry = {
      id:        Date.now(),
      result,
      name:      result.name || "Réunion analysée",
      date:      result.date || new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
      icon:      "📋",
      color:     C.accentL,
      icolor:    C.accent,
      decisions: (result.decisions || []).length,
      actions:   (result.actions || []).length,
      risks:     (result.risks || []).length,
      questions: (result.openQuestions || []).length,
      live:      !result._live,
    };
    setMeetingsList(prev => [entry, ...prev]); // plus récent en tête
    setActiveCR(result);
  };

  if (screen === "landing")    return <LandingPage onStart={() => setScreen("onboarding")} />;
  if (screen === "onboarding") return <Onboarding onDone={handleOnboardDone} />;

  const pageMap = {
    dashboard: <PageDashboard setPage={setPage} role={role} meetingsList={meetingsList} setActiveCR={setActiveCR} />,
    upload:    <PageUpload    setPage={setPage} setMeetingResult={handleMeetingResult} />,
    cr:        <PageCR        setPage={setPage} role={role} result={activeCR} />,
    meetings:  <PageMeetings  setPage={setPage} meetingsList={meetingsList} setActiveCR={setActiveCR} />,
    actions:   <PageDashboard setPage={setPage} role={role} meetingsList={meetingsList} setActiveCR={setActiveCR} />,
    memory:    <PageMemory    setPage={setPage} role={role} />,
    analytics: <PageAnalytics setPage={setPage} role={role} />,
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar page={page} setPage={setPage} role={role} setRole={setRole} meetingsList={meetingsList} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {pageMap[page] || pageMap.dashboard}
      </div>
    </div>
  );
}
