import gsap from 'gsap';
import React, { useEffect, useRef } from 'react';
import { useCompany } from '../../contexts/CompanyContext';

const AIGlobalInsights: React.FC = () => {
  const { data, regenerateAI } = useCompany();
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (ref.current) gsap.from(ref.current.children, { opacity: 0, y: 30, stagger: 0.12, duration: 0.7 });
  }, []);

  return (
    <div className="glass p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">AI Global Insights</h3>
        <button className="btn-ghost" onClick={regenerateAI}>Regenerate AI Insights</button>
      </div>
      <div ref={ref} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.aiInsights.map((ins, i) => (
          <div key={i} className="p-4 bg-white/5 rounded card">
            <div className="text-sm text-white/60">{ins.metric}</div>
            <div className="text-2xl font-bold text-white">{ins.value}</div>
            <div className="text-xs text-white/50 mt-2">{ins.note}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIGlobalInsights;
