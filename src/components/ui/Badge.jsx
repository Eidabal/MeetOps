export const Badge = ({ text, bg, color, style = {} }) => (
  <span
    className="text-[10px] font-bold px-2 py-0.5 rounded tracking-[0.4px] uppercase"
    style={{ background: bg, color, ...style }}
  >
    {text}
  </span>
);
