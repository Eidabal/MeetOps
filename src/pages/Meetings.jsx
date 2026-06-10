import { C, DEMO_RESULT } from "../lib/constants";
import { Badge } from "../components/ui/Badge";
import { Btn } from "../components/ui/Btn";
import { Topbar } from "../components/layout/Topbar";

export function PageMeetings({ setPage, meetingsList = [], setActiveCR }) {
  // Réunions statiques de démo
  const STATIC = [
    { id: "s1", icon: "☁️", color: C.accentL, icolor: C.accent, name: "Migration Azure — Arbitrage infra", date: "25 mai 2026", users: 6, d: 3, a: 5, r: 2, status: "analysé", result: DEMO_RESULT },
    { id: "s2", icon: "🔗", color: C.tealL, icolor: C.teal, name: "Design review — API Gateway v2", date: "24 mai 2026", users: 4, d: 1, q: 3, status: "analysé", result: null },
    { id: "s3", icon: "🔒", color: C.amberL, icolor: C.amber, name: "IAM & compliance — Audit Q2", date: "22 mai 2026", users: 8, r: 4, a: 7, status: "analysé", result: null },
    { id: "s4", icon: "📊", color: C.purpleL, icolor: C.purple, name: "Data Platform — Revue architecture", date: "20 mai 2026", users: 5, d: 2, a: 3, status: "analysé", result: null },
    { id: "s5", icon: "🚀", color: C.greenL, icolor: C.green, name: "Sprint review S21", date: "19 mai 2026", users: 10, a: 8, q: 2, status: "analysé", result: null },
  ];

  // Vraies réunions analysées en premier, puis statiques
  const allMeetings = [
    ...meetingsList.map(m => ({
      id: m.id,
      icon: "✦",
      color: C.accentL,
      icolor: C.accent,
      name: m.name,
      date: m.date,
      users: null,
      d: m.decisions,
      a: m.actions,
      r: m.risks,
      q: m.questions,
      status: m.live ? "live IA" : "analysé",
      result: m.result,
      isNew: true,
    })),
    ...STATIC,
  ];

  const handleClick = (m) => {
    if (m.result) {
      setActiveCR(m.result);
      setPage("cr");
    } else {
      // Réunion statique sans CR complet — charge le DEMO_RESULT par défaut
      setActiveCR(DEMO_RESULT);
      setPage("cr");
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <Topbar title="Meetings">
        <div className="text-xs text-text3">{meetingsList.length > 0 && <span className="text-green font-semibold">✦ {meetingsList.length} nouvelle{meetingsList.length > 1 ? "s" : ""} analysée{meetingsList.length > 1 ? "s" : ""}</span>}</div>
        <Btn onClick={() => setPage("upload")} primary><i className="ti ti-plus text-sm" />Nouvelle analyse</Btn>
      </Topbar>
      <div className="flex-1 overflow-y-auto p-[22px]">
        {meetingsList.length > 0 && (
          <div className="bg-greenL border border-green/20 rounded-[9px] px-4 py-2.5 mb-4 flex items-center gap-2.5 text-[13px]">
            <i className="ti ti-sparkles text-green text-sm" />
            <span className="text-text1 font-medium">
              {meetingsList.length} réunion{meetingsList.length > 1 ? "s" : ""} analysée{meetingsList.length > 1 ? "s" : ""} cette session
            </span>
            <span className="text-text3 text-xs">— cliquez pour accéder au compte rendu</span>
          </div>
        )}
        <div className="bg-bg2 border border-border rounded-[10px] overflow-hidden">
          <div className="grid grid-cols-[1fr_110px_90px_180px_90px] px-[18px] py-2 bg-bg3 text-[10px] text-text3 uppercase tracking-[0.5px] font-semibold gap-3">
            <span>Réunion</span><span>Date</span><span>Participants</span><span>Analyse</span><span>Statut</span>
          </div>
          {allMeetings.map((m, i) => (
            <div key={m.id || i} onClick={() => handleClick(m)}
              className={`grid grid-cols-[1fr_110px_90px_180px_90px] px-[18px] py-[13px] border-t border-border gap-3 cursor-pointer items-center transition-colors duration-150 hover:bg-bg3 ${m.isNew ? "bg-accentT" : ""}`}>
              <div className="flex items-center gap-[11px] min-w-0">
                <div className="w-[34px] h-[34px] rounded-lg shrink-0 flex items-center justify-center text-base"
                  style={{ background: m.color, border: m.isNew ? `1px solid ${C.accent}44` : "none" }}>
                  {m.isNew ? <i className="ti ti-sparkles text-sm" style={{ color: C.accent }} /> : m.icon}
                </div>
                <div className="min-w-0">
                  <div className={`text-[13px] text-text1 whitespace-nowrap overflow-hidden text-ellipsis ${m.isNew ? "font-semibold" : "font-medium"}`}>{m.name}</div>
                  {m.isNew && <div className="text-[10px] text-accent mt-px">✦ Analysée cette session</div>}
                </div>
              </div>
              <span className="text-xs text-text3">{m.date}</span>
              <span className="text-xs text-text3">{m.users ? `👥 ${m.users}` : "—"}</span>
              <div className="flex gap-[5px] flex-wrap">
                {m.d > 0 && <Badge text={`${m.d} déc`} bg={C.accentL} color={C.accent} />}
                {m.a > 0 && <Badge text={`${m.a} act`} bg={C.tealL} color={C.teal} />}
                {m.r > 0 && <Badge text={`${m.r} risq`} bg={C.redL} color={C.red} />}
                {m.q > 0 && <Badge text={`${m.q} Q`} bg={C.amberL} color={C.amber} />}
              </div>
              <Badge
                text={m.status}
                bg={m.isNew ? C.accentL : C.greenL}
                color={m.isNew ? C.accent : C.green} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
