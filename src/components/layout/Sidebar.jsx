import { useState } from "react";
import { Badge } from "../ui/Badge";
import { C, ROLES } from "../../lib/constants";

export function Sidebar({ page, setPage, role, setRole, meetingsList = [] }) {
  const sel = ROLES.find(r => r.id === role) || ROLES[0];
  const [showRoles, setShowRoles] = useState(false);

  const nav = [
    { id: "dashboard", icon: "layout-dashboard", label: "Dashboard" },
    { id: "meetings", icon: "calendar-event", label: "Meetings", badge: meetingsList.length > 0 ? meetingsList.length : null, badgeColor: C.accent },
    { id: "cr", icon: "file-description", label: "Compte Rendu", badge: meetingsList.length > 0 ? meetingsList.length : null, badgeColor: C.accent },
    { id: "actions", icon: "checkbox", label: "Actions", badge: 5, badgeColor: C.red },
    { id: "memory", icon: "history", label: "Meeting Memory" },
    { id: "analytics", icon: "chart-dots", label: "Analytics" },
  ];
  const exports = [
    { id: "teams", icon: "brand-teams", label: "Teams", ok: true },
    { id: "jira", icon: "brand-jira", label: "Jira" },
  ];

  return (
    <aside className="w-[220px] min-w-[220px] bg-bg2 border-r border-border flex flex-col relative z-10">
      {/* Logo */}
      <div className="px-[18px] pt-[18px] pb-[14px] border-b border-border flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg shrink-0 bg-brand flex items-center justify-center text-base">🧠</div>
        <div>
          <div className="text-sm font-extrabold text-text1 tracking-[-0.3px]">MeetCopilot</div>
          <div className="text-[9px] text-text3 uppercase tracking-[0.8px]">AI Meeting OS</div>
        </div>
      </div>

      {/* Role picker */}
      <div className="mx-3 mt-3 relative">
        <div onClick={() => setShowRoles(s => !s)}
          className="bg-bg3 rounded-lg px-3 py-[9px] cursor-pointer flex items-center justify-between"
          style={{ border: `1px solid ${sel.color}33` }}>
          <div>
            <div className="text-[10px] text-text3 uppercase tracking-[0.5px] mb-[3px]">Rôle actif</div>
            <div className="text-[13px] font-semibold flex items-center gap-1.5" style={{ color: sel.color }}>
              <span>{sel.icon}</span>{sel.label}
            </div>
          </div>
          <i className="ti ti-chevron-down text-[13px] text-text3 transition-transform duration-200"
            style={{ transform: showRoles ? "rotate(180deg)" : "none" }} />
        </div>
        {showRoles && (
          <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-[100] bg-bg3 border border-border2 rounded-[10px] shadow-[0_12px_40px_rgba(0,0,0,0.5)] overflow-hidden">
            {ROLES.map(r => (
              <div key={r.id} onClick={() => { setRole(r.id); setShowRoles(false); }}
                className="flex items-center gap-[9px] px-3 py-[9px] cursor-pointer text-[13px]"
                style={{ background: role === r.id ? `${r.color}15` : "transparent", color: role === r.id ? r.color : C.text2 }}>
                <span>{r.icon}</span>{r.label}
                {role === r.id && <span className="ml-auto text-xs" style={{ color: r.color }}>✓</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="px-2.5 py-[14px] flex-1 overflow-y-auto">
        <div className="text-[9px] text-text3 uppercase tracking-[1px] px-2 mb-[5px] mt-1 font-semibold">Workspace</div>
        {nav.map(({ id, icon, label, badge, badgeColor }) => (
          <div key={id} onClick={() => setPage(id)}
            className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13px] cursor-pointer mb-0.5 relative transition-all duration-150"
            style={{ background: page === id ? C.accentL : "transparent", color: page === id ? C.accent : C.text2 }}>
            {page === id && <span className="absolute -left-2.5 top-1/2 -translate-y-1/2 w-[3px] h-[18px] bg-accent rounded-r-[3px]" />}
            <i className={`ti ti-${icon} text-base`} style={{ color: page === id ? C.accent : C.text3 }} />
            <span className="flex-1">{label}</span>
            {badge && <span className="text-[10px] font-bold px-1.5 py-px rounded-[10px] text-white" style={{ background: badgeColor }}>{badge}</span>}
          </div>
        ))}
        <div className="text-[9px] text-text3 uppercase tracking-[1px] px-2 mt-[14px] mb-[5px] font-semibold">Exports</div>
        {exports.map(({ id, icon, label, ok }) => (
          <div key={id} className="flex items-center gap-2.5 px-2.5 py-2 rounded-[7px] text-[13px] text-text2 cursor-pointer mb-0.5">
            <i className={`ti ti-${icon} text-base text-text3`} />
            <span className="flex-1">{label}</span>
            {ok && <Badge text="Live" bg={C.greenL} color={C.green} />}
          </div>
        ))}
      </nav>

      {/* User */}
      <div className="px-[14px] py-3 border-t border-border flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full shrink-0 bg-brand2 flex items-center justify-center text-xs font-bold text-white">JD</div>
        <div className="flex-1 overflow-hidden">
          <div className="text-[13px] font-semibold whitespace-nowrap overflow-hidden text-ellipsis">Jean Dupont</div>
          <div className="text-[11px] text-teal">Pro plan</div>
        </div>
        <i className="ti ti-settings text-[15px] text-text3 cursor-pointer" />
      </div>
    </aside>
  );
}
