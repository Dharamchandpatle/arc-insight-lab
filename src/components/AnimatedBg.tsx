import gsap from "gsap";
import { useEffect, useRef } from "react";

const AnimatedBg = () => {
  const refs = useRef<HTMLDivElement[]>([]);
  refs.current = [];

  const addRef = (el: HTMLDivElement | null) => {
    if (el) refs.current.push(el);
  };

  useEffect(() => {
    // animate each circle with a slow, looping movement
    refs.current.forEach((el, i) => {
      const duration = 12 + Math.random() * 18;
      const x = -30 + Math.random() * 60; // percent
      const y = -30 + Math.random() * 60; // percent
      gsap.to(el, {
        x: `${x}%`,
        y: `${y}%`,
        scale: 0.6 + Math.random() * 1.2,
        opacity: 0.12 + Math.random() * 0.25,
        duration,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        delay: i * 1.2,
      });
    });

    return () => {
      gsap.killTweensOf(refs.current);
    };
  }, []);

  const circles = [
    { size: 900, color: 'rgba(0,191,255,0.06)', left: '-10%', top: '-10%' },
    { size: 700, color: 'rgba(30,144,255,0.06)', left: '60%', top: '-20%' },
    { size: 600, color: 'rgba(65,105,225,0.05)', left: '20%', top: '60%' },
    { size: 900, color: 'rgba(0,0,205,0.04)', left: '-20%', top: '40%' },
  ];

  return (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
      {circles.map((c, i) => (
        <div
          key={i}
          ref={addRef}
          style={{
            position: 'absolute',
            left: c.left,
            top: c.top,
            width: c.size,
            height: c.size,
            marginLeft: -(c.size / 2),
            marginTop: -(c.size / 2),
            background: c.color,
            borderRadius: '50%',
            filter: 'blur(100px)',
            transform: 'translate3d(0,0,0)',
            mixBlendMode: 'screen',
            opacity: 0.12,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBg;
