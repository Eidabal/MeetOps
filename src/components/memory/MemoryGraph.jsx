import { useEffect, useRef } from "react";
import { C } from "../../lib/constants";

export function MemoryGraph({ meetings, links, selectedId, onSelect }) {
  const canvasRef = useRef();
  const W = 680, H = 260;

  const positions = {};
  meetings.forEach((m, i) => {
    const t = i / Math.max(meetings.length - 1, 1);
    positions[m.id] = {
      x: 50 + t * (W - 100),
      y: H / 2 + Math.sin(t * Math.PI * 0.9) * -55 + (i % 2 === 0 ? -18 : 18),
    };
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width  = W + "px";
    canvas.style.height = H + "px";
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, W, H);

    // Links
    links.forEach(link => {
      const a = positions[link.from], b = positions[link.to];
      if (!a || !b) return;
      const col = link.type==="inconsistency"?"#F87171":link.type==="recurring"?"#FBBF24":link.type==="open"?"#2DD4BF":"#6366F1";
      const fade = selectedId && selectedId!==link.from && selectedId!==link.to;
      const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2 - 28;
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.quadraticCurveTo(mx, my, b.x, b.y);
      ctx.strokeStyle = col + (fade ? "25" : "77");
      ctx.lineWidth   = selectedId===link.from||selectedId===link.to ? 2.5 : 1.2;
      ctx.setLineDash(link.type==="inconsistency"?[4,3]:link.type==="recurring"?[6,3]:[]);
      ctx.stroke();
      ctx.setLineDash([]);
      // Arrowhead
      const ang = Math.atan2(b.y - my, b.x - mx);
      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(b.x - 7*Math.cos(ang-0.45), b.y - 7*Math.sin(ang-0.45));
      ctx.lineTo(b.x - 7*Math.cos(ang+0.45), b.y - 7*Math.sin(ang+0.45));
      ctx.closePath();
      ctx.fillStyle = col + (fade ? "25" : "77");
      ctx.fill();
    });
  }, [selectedId, JSON.stringify(links)]);

  return (
    <div style={{position:"relative", width:W, height:H, flexShrink:0}}>
      <canvas ref={canvasRef} style={{position:"absolute",top:0,left:0,pointerEvents:"none"}}/>
      {meetings.map(m => {
        const p = positions[m.id];
        if (!p) return null;
        const sel = selectedId === m.id;
        const hasL = links.some(l => l.from===m.id||l.to===m.id);
        return (
          <div key={m.id}>
            <div onClick={() => onSelect(m.id === selectedId ? null : m.id)}
              style={{position:"absolute", left:p.x-17, top:p.y-17, width:34, height:34, borderRadius:"50%",
                background: sel ? m.icolor : hasL ? m.color : C.bg4,
                border:`2px solid ${sel ? m.icolor : hasL ? m.icolor+"55" : C.border2}`,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:13, cursor:"pointer", transition:"all .2s", zIndex:2,
                boxShadow: sel ? `0 0 0 4px ${m.icolor}33` : "none" }}>
              {m.icon}
            </div>
            <div style={{position:"absolute", left:p.x, top:p.y+20, transform:"translateX(-50%)",
              fontSize:8, color:sel?C.text1:C.text3, fontWeight:sel?600:400,
              whiteSpace:"nowrap", pointerEvents:"none", transition:"color .2s"}}>
              {m.date.split(" ").slice(0,2).join(" ")}
            </div>
          </div>
        );
      })}
    </div>
  );
}
