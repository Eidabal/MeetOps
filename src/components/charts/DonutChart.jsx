import { C } from "../../lib/constants";

export function DonutChart({ segments, size=100, thickness=18 }) {
  const total = segments.reduce((s, d) => s + d.value, 0);
  const r = (size - thickness) / 2;
  const cx = size / 2, cy = size / 2;
  let cumAngle = -Math.PI / 2;
  const arcs = segments.map(seg => {
    const angle = (seg.value / total) * 2 * Math.PI;
    const x1 = cx + r * Math.cos(cumAngle);
    const y1 = cy + r * Math.sin(cumAngle);
    cumAngle += angle;
    const x2 = cx + r * Math.cos(cumAngle);
    const y2 = cy + r * Math.sin(cumAngle);
    const large = angle > Math.PI ? 1 : 0;
    const path = `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
    return { ...seg, path, angle };
  });
  return (
    <svg width={size} height={size}>
      {arcs.map((arc, i) => (
        <path key={i} d={arc.path} fill="none" stroke={arc.color} strokeWidth={thickness}
          strokeLinecap="butt" opacity={0.85}/>
      ))}
      <circle cx={cx} cy={cy} r={r - thickness/2 - 2} fill={C.bg2}/>
    </svg>
  );
}
