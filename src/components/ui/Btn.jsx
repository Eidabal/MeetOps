import { C } from "../../lib/constants";

export const Btn = ({ children, onClick, primary, style = {} }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-1.5 px-3.5 py-[7px] rounded-[7px] text-xs font-semibold cursor-pointer"
    style={{
      background: primary ? "linear-gradient(135deg,#6366F1,#A78BFA)" : C.bg3,
      color: primary ? "white" : C.text1,
      border: primary ? "none" : `1px solid ${C.border2}`,
      boxShadow: primary ? "0 3px 14px rgba(99,102,241,0.35)" : "none",
      ...style,
    }}
  >
    {children}
  </button>
);
