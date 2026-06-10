import { C } from "../../lib/constants";

export function MiniBarChart({ data, valueKey, colorKey, labelKey, height=80, highlightLast=true }) {
  const max = Math.max(...data.map(d => d[valueKey]));
  return (
    <div style={{display:"flex",alignItems:"flex-end",gap:4,height}}>
      {data.map((d, i) => {
        const pct = max > 0 ? d[valueKey] / max : 0;
        const isLast = i === data.length - 1;
        const barColor = colorKey ? d[colorKey] : (highlightLast && isLast ? C.accent : C.bg4);
        return (
          <div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <div style={{width:"100%",display:"flex",flexDirection:"column",justifyContent:"flex-end",height:height-18}}>
              <div style={{
                width:"100%",
                height: Math.max(3, pct * (height - 18)),
                background: barColor,
                borderRadius:"3px 3px 0 0",
                transition:"height .5s ease",
                opacity: highlightLast && !isLast ? 0.45 : 1,
              }}/>
            </div>
            {labelKey && <div style={{fontSize:8,color:C.text3,textAlign:"center",lineHeight:1}}>{d[labelKey]}</div>}
          </div>
        );
      })}
    </div>
  );
}
