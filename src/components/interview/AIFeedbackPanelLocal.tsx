import gsap from 'gsap';
import React, { useEffect, useRef } from 'react';

interface AIFeedbackPanelProps {
  items: { question?: string; feedback: string; score?: number }[];
}

export const AIFeedbackPanelLocal: React.FC<AIFeedbackPanelProps> = ({ items }) => {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    gsap.from(ref.current.children, { opacity: 0, y: 20, stagger: 0.08, duration: 0.5 });
  }, [items.length]);

  return (
    <div ref={ref} className="glass p-4 rounded-xl space-y-3">
      <h3 className="text-lg font-orbitron text-[#7C3AED]">AI Feedback</h3>
      {items.length === 0 && <div className="text-sm text-white/60">AI feedback will appear after each answer.</div>}
      {items.map((it, i) => (
        <div key={i} className="p-3 bg-white/3 rounded-lg">
          <div className="flex justify-between items-start">
            <div>
              {it.question && <div className="text-xs text-sky-300">Q: {it.question}</div>}
              <div className="font-medium text-white mt-1">{it.feedback}</div>
            </div>
            {typeof it.score === 'number' && (
              <div className="text-2xl font-bold text-[#00BFFF]">{it.score}/10</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AIFeedbackPanelLocal;
