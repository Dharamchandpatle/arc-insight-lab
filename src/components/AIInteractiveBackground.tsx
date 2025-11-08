import gsap from "gsap";
import React, { useEffect, useRef } from "react";

const rand = (min: number, max: number) => Math.random() * (max - min) + min;

const AIInteractiveBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const orbRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<HTMLDivElement | null>(null);
  const particleEls = useRef<HTMLDivElement[]>([]);
  particleEls.current = particleEls.current.slice(0, particleEls.current.length);

  const addParticle = (el: HTMLDivElement | null) => {
    if (el) particleEls.current.push(el);
  };

  useEffect(() => {
    const container = containerRef.current;
    const orb = orbRef.current;
    const particles = particleEls.current;
    if (!container || !orb) return;

    const prefersReduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Determine particles count by screen size
    const width = window.innerWidth;
    let particleCount = 20;
    if (width < 768) particleCount = 8;
    else if (width < 1200) particleCount = 14;

    // Create missing particles if needed
    if (particleEls.current.length < particleCount && particlesRef.current) {
      const missing = particleCount - particleEls.current.length;
      for (let i = 0; i < missing; i++) {
        const p = document.createElement("div");
        p.className = "absolute rounded-full";
        p.style.width = "6px";
        p.style.height = "6px";
        p.style.background = "rgba(0,191,255,0.28)";
        p.style.boxShadow = "0 0 8px rgba(0,191,255,0.28), 0 0 16px rgba(30,144,255,0.18)";
        p.style.left = "50%";
        p.style.top = "50%";
        p.style.transform = `translate(-50%, -50%)`;
        particlesRef.current!.appendChild(p);
        particleEls.current.push(p as unknown as HTMLDivElement);
      }
    }

    // Orb animations: rotation, drift, pulse
    const ttl = gsap.timeline();
    if (!prefersReduced) {
      ttl.to(orb, { rotation: 360, duration: 55, ease: "none", repeat: -1, transformOrigin: "50% 50%" }, 0);
      ttl.to(orb, { x: rand(-18, 18), y: rand(-10, 10), duration: 8, ease: "sine.inOut", yoyo: true, repeat: -1 }, 0);
      ttl.to(orb, { scale: 1.035, duration: 5.5, ease: "sine.inOut", yoyo: true, repeat: -1 }, 0);
      ttl.to(orb, { opacity: 0.95, duration: 5.5, ease: "sine.inOut", yoyo: true, repeat: -1 }, 0);
    }

    // Particle motion — gentle orbits & random drift
    particleEls.current.forEach((el, i) => {
      const angle = rand(0, 360);
      const radius = rand(orb.offsetWidth * 0.18, orb.offsetWidth * 0.48);
      // position function
      const setPos = () => {
        const a = (angle + i * (360 / particleEls.current.length)) * (Math.PI / 180);
        const x = (orb.offsetWidth / 2) + radius * Math.cos(a);
        const y = (orb.offsetHeight / 2) + radius * Math.sin(a);
        gsap.set(el, { x: x - orb.offsetWidth / 2, y: y - orb.offsetHeight / 2 });
      };
      setPos();

      if (!prefersReduced) {
        const dur = rand(8, 20);
        gsap.to(el, {
          motionPath: {
            path: [
              { x: 0, y: 0 },
              { x: rand(-20, 20), y: rand(-12, 12) },
              { x: rand(-30, 30), y: rand(-18, 18) },
              { x: 0, y: 0 },
            ],
          },
          duration: dur,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: rand(0, 4),
        } as any);
      }
    });

    // Mouseparallax: subtle follow effect
    let mouseHandler: ((e: MouseEvent) => void) | null = null;
    if (!prefersReduced) {
      mouseHandler = (e: MouseEvent) => {
        const rect = container.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / rect.width; // -0.5..0.5
        const dy = (e.clientY - cy) / rect.height;
        gsap.to(orb, { x: dx * 28, y: dy * 20, duration: 0.9, ease: "power3.out" });
        // also nudge particles lightly
        particleEls.current.forEach((p, idx) => gsap.to(p, { x: `+=${dx * (idx % 3 + 1) * 2}`, y: `+=${dy * (idx % 2 + 1) * 2}`, duration: 1.2, ease: "sine.out" }));
      };
      window.addEventListener("mousemove", mouseHandler);
    }

    const resizeHandler = () => {
      // re-calc particle positions
      particleEls.current.forEach((el) => gsap.set(el, { x: 0, y: 0 }));
    };
    window.addEventListener("resize", resizeHandler);

    return () => {
      ttl.kill();
      gsap.killTweensOf([orb, ...particleEls.current]);
      if (mouseHandler) window.removeEventListener("mousemove", mouseHandler);
      window.removeEventListener("resize", resizeHandler);
      // remove any programmatically added particles
      if (particlesRef.current) particlesRef.current.innerHTML = "";
      particleEls.current = [];
    };
  }, []);

  // orb responsive size styles
  const orbStyle: React.CSSProperties = {
    // increased responsive size to make the orb more prominent
    width: "clamp(450px, 50vw, 1200px)",
    height: "clamp(450px, 50vw, 1200px)",
  };

  return (
    <div ref={containerRef} className="absolute inset-0 -z-10 pointer-events-none flex items-center justify-center" style={{ background: "linear-gradient(to bottom, #0A0E2A 0%, #000000 100%)" }}>
      <div ref={orbRef} className="relative rounded-full flex items-center justify-center" style={orbStyle}>
        {/* Glowing orb */}
        <div
          className="absolute rounded-full"
          style={{
            inset: 0,
            background: "radial-gradient(circle, rgba(0,191,255,0.25) 0%, rgba(0,0,0,0) 70%)",
            boxShadow: "0 0 140px #00BFFF, 0 0 260px #1E90FF",
            filter: "blur(100px)",
            mixBlendMode: "screen",
            opacity: 0.95,
          }}
        />

        {/* concentric ring outline */}
        <div className="absolute rounded-full" style={{ inset: "6%", border: "1px solid rgba(0,191,255,0.06)", mixBlendMode: "screen" }} />

        {/* particles container (DOM-created children) */}
        <div ref={particlesRef} className="absolute inset-0 rounded-full" />

        {/* subtle top fade overlay for readability */}
        <div className="absolute inset-0 rounded-full pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(10,14,42,0.0), rgba(0,0,0,0.18))' }} />
      </div>
    </div>
  );
};

export default AIInteractiveBackground;
