import { useState, useEffect, useRef } from "react";

export function Reveal({ children, style={} }) {
  const ref = useRef();
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if(e.isIntersecting) setVis(true); }, { threshold:0.07, rootMargin:"0px 0px -30px 0px" });
    if(ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return <div ref={ref} style={{ opacity:vis?1:0, transform:vis?"none":"translateY(24px)", transition:"opacity .7s ease, transform .7s ease", ...style }}>{children}</div>;
}
