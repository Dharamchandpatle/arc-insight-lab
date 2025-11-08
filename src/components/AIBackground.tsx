import gsap from "gsap";
import React, { useEffect, useRef } from "react";

const AIBackground: React.FC = () => {
  const orbRef = useRef<HTMLDivElement | null>(null);
  const dotsContainerRef = useRef<HTMLDivElement | null>(null);
  const dotsRefs = useRef<HTMLDivElement[]>([]);
  dotsRefs.current = [];

  const addDot = (el: HTMLDivElement | null) => {
    if (el) dotsRefs.current.push(el);
  };

  useEffect(() => {
    const orb = orbRef.current;
    const dotsContainer = dotsContainerRef.current;
    if (!orb || !dotsContainer) return;

    const prefersReduced = typeof window !== "undefined" && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // responsive amplitude (smaller on mobile)
    const getAmplitude = () => {
      const w = window.innerWidth;
      if (w < 768) return 10; // px
      if (w < 1200) return 20;
      return 36;
    };

    // main timeline: rotation + drift + pulse
    const tl = gsap.timeline();

    // rotation (slow)
    tl.to(orb, {
      rotation: 360,
      duration: prefersReduced ? 0 : 90,
      ease: "none",
      repeat: -1,
      transformOrigin: "50% 50%",
    }, 0);

    // drift (x/y subtle yoyo motion)
    const amp = getAmplitude();
    tl.to(orb, {
      x: () => `${amp}px`,
      y: () => `${-amp / 2}px`,
      duration: prefersReduced ? 0 : 8,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      repeatRefresh: true,
    }, 0);

    // breathing pulse
    tl.to(orb, {
      scale: 1.04,
      duration: prefersReduced ? 0 : 6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    }, 0);

    // subtle flicker on glow (affects opacity)
    tl.to(orb, {
      opacity: 0.95,
      duration: prefersReduced ? 0 : 5,
      yoyo: true,
      repeat: -1,
      ease: "sine.inOut",
    }, 0);

    // orbiting dots rotation
    gsap.to(dotsContainer, {
      rotation: 360,
      duration: prefersReduced ? 0 : 24,
      repeat: -1,
      ease: "none",
      transformOrigin: "50% 50%",
    });

    // individual dot subtle animations
    dotsRefs.current.forEach((d, i) => {
      // Use numeric yPercent via keyframes by animating to a value and yoyoing
      gsap.to(d, {
        yPercent: 4,
        duration: 3 + i,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.2,
      });
    });

    // mouse parallax (small, optional)
    let handleMove: ((e: MouseEvent) => void) | null = null;
    if (!prefersReduced) {
      handleMove = (e: MouseEvent) => {
        const rect = orb.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = (e.clientX - cx) / rect.width; // -0.5 .. 0.5
        const dy = (e.clientY - cy) / rect.height;
        gsap.to(orb, { x: dx * 24, y: dy * 12, duration: 0.9, ease: "power3.out" });
      };
      window.addEventListener("mousemove", handleMove);
    }

    const onResize = () => {
      // update drift amplitude on resize
      const a = getAmplitude();
      gsap.to(orb, { duration: 0.8, x: 0, y: 0 });
      // we keep rotation timeline running; amplitude used in subsequent tweens
    };
    window.addEventListener("resize", onResize);

    return () => {
      tl.kill();
      gsap.killTweensOf([orb, dotsContainer, ...dotsRefs.current]);
      if (handleMove) window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // responsive sizes via CSS -- small screens smaller orb
  const orbSizeStyle: React.CSSProperties = {
    // larger max size for a more immersive background
    width: "min(100vw, 1400px)",
    height: "min(100vw, 1400px)",
  };

  return (
    <div aria-hidden className="absolute inset-0 -z-20 pointer-events-none flex items-center justify-center">
      <div
        ref={orbRef}
        className="relative flex items-center justify-center"
        style={{ ...orbSizeStyle }}
      >
        {/* Soft glowing orb */}
        <div
          className="absolute rounded-full"
          style={{
            inset: 0,
            background: "radial-gradient(circle, rgba(0,191,255,0.25) 0%, rgba(0,0,0,0) 70%)",
            boxShadow: "0 0 140px #00BFFF, 0 0 260px #1E90FF",
            filter: "blur(100px)",
            mixBlendMode: "screen",
            opacity: 0.9,
            transition: "opacity 0.3s",
          }}
        />

        {/* faint inner ring for structure */}
        <div
          className="absolute rounded-full border"
          style={{
            inset: "8%",
            borderColor: "rgba(0,191,255,0.08)",
            boxShadow: "0 0 60px rgba(0,191,255,0.06)",
            mixBlendMode: "screen",
          }}
        />

        {/* Orbiting dots container */}
        <div ref={dotsContainerRef} className="absolute inset-0 rounded-full">
          <div
            ref={addDot}
            className="absolute w-3 h-3 rounded-full"
            style={{ left: "50%", top: "6%", transform: "translate(-50%, -50%)", background: "#00BFFF", boxShadow: "0 0 12px #00BFFF, 0 0 24px #1E90FF" }}
          />
          <div
            ref={addDot}
            className="absolute w-3 h-3 rounded-full"
            style={{ left: "88%", top: "50%", transform: "translate(-50%, -50%)", background: "#1E90FF", boxShadow: "0 0 12px #00BFFF, 0 0 24px #1E90FF" }}
          />
          <div
            ref={addDot}
            className="absolute w-3 h-3 rounded-full"
            style={{ left: "12%", top: "50%", transform: "translate(-50%, -50%)", background: "#4169E1", boxShadow: "0 0 12px #00BFFF, 0 0 24px #1E90FF" }}
          />
        </div>

        {/* top gradient overlay to keep content readable (fade edges) */}
        <div className="absolute inset-0 pointer-events-none rounded-full" style={{ background: 'linear-gradient(to bottom, rgba(10,14,42,0.0), rgba(0,0,0,0.25))' }} />
      </div>
    </div>
  );
};

export default AIBackground;
