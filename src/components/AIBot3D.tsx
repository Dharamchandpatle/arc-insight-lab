import { useEffect, useRef } from "react";
import gsap from "gsap";
import { useTheme } from "@/contexts/ThemeContext";

export const AIBot3D = () => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (canvasRef.current) {
      // Animate on mount
      gsap.from(canvasRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      // Floating animation
      gsap.to(canvasRef.current, {
        y: -20,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }
  }, []);

  return (
    <div
      ref={canvasRef}
      className={cn(
        "relative w-64 h-64 rounded-full mx-auto",
        "flex items-center justify-center",
        "glass cursor-pointer",
        theme === "dark" ? "glow-blue" : "shadow-lg"
      )}
    >
      {/* Placeholder for 3D bot - will be replaced with Three.js */}
      <div className="w-32 h-32 rounded-full bg-gradient-blue animate-glow-pulse flex items-center justify-center">
        <span className="text-4xl font-heading font-bold text-white">AI</span>
      </div>
      
      {/* Orbiting particles */}
      <div className="absolute inset-0">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="absolute top-1/2 left-1/2 w-3 h-3 rounded-full bg-primary"
            style={{
              animation: `orbit ${3 + i}s linear infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes orbit {
          from {
            transform: translate(-50%, -50%) rotate(0deg) translateX(100px) rotate(0deg);
          }
          to {
            transform: translate(-50%, -50%) rotate(360deg) translateX(100px) rotate(-360deg);
          }
        }
      `}</style>
    </div>
  );
};

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}
