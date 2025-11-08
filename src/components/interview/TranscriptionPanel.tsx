import gsap from "gsap";
import React, { useEffect, useRef } from "react";

interface TranscriptionPanelProps {
  candidateText: string[];
  hrText: string[];
}

export const TranscriptionPanel: React.FC<TranscriptionPanelProps> = ({ candidateText, hrText }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    // scroll to bottom when new text arrives
    containerRef.current.scrollTo({ top: containerRef.current.scrollHeight, behavior: "smooth" });
  }, [candidateText.length, hrText.length]);

  useEffect(() => {
    // fade-in animation for new lines
    const nodes = containerRef.current?.querySelectorAll('.line');
    if (!nodes) return;
    gsap.fromTo(nodes, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.35, stagger: 0.03 });
  }, [candidateText.length, hrText.length]);

  return (
    <div ref={containerRef} className="bg-[#050816]/40 rounded-md p-3 max-h-48 overflow-y-auto text-sm text-sky-100">
      {candidateText.map((t, i) => (
        <div key={`c-${i}`} className="line py-1">
          <strong className="text-xs text-sky-300">Candidate:</strong>
          <div className="mt-1">{t}</div>
        </div>
      ))}

      {hrText.map((t, i) => (
        <div key={`h-${i}`} className="line py-1">
          <strong className="text-xs text-emerald-300">HR:</strong>
          <div className="mt-1">{t}</div>
        </div>
      ))}
    </div>
  );
};

export default TranscriptionPanel;
