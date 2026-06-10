export function Topbar({ title, children }) {
  return (
    <div className="h-[54px] bg-bg2 border-b border-border flex items-center px-[22px] gap-3 shrink-0">
      <div className="text-[15px] font-bold text-text1 flex-1">{title}</div>
      {children}
    </div>
  );
}
