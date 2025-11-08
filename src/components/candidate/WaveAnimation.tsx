import React, { useEffect, useRef } from "react";
import gsap from "gsap";

export const WaveAnimation: React.FC<{ color?: string }> = ({ color = "#00BFFF" }) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const bars = Array.from(el.querySelectorAll('.bar')) as HTMLElement[];
    bars.forEach((b, i) => {
      gsap.to(b, { height: `${20 + Math.random() * 60}px`, duration: 0.8 + Math.random() * 0.6, yoyo: true, repeat: -1, delay: i * 0.08, ease: 'sine.inOut' });
    });
    return () => gsap.killTweensOf(bars);
  }, []);

  return (
    <div ref={ref} className="flex items-end gap-1 h-12">
      {[...Array(24)].map((_, i) => (
        <div key={i} className="bar" style={{ width: 4, height: 12, background: color, borderRadius: 4, opacity: 0.9 }} />
      ))}
    </div>
  );
};

export default WaveAnimation;
