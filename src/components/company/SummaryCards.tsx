import gsap from 'gsap';
import React, { useEffect, useRef } from 'react';
import { useCompany } from '../../contexts/CompanyContext';

const SummaryCards: React.FC = () => {
  const { data } = useCompany();
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (ref.current) gsap.from(ref.current.children, { opacity: 0, y: 30, stagger: 0.12, duration: 0.7 });
  }, []);

  return (
    <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 bg-[#0A0E2A]/70 backdrop-blur-lg rounded-xl border border-[#00BFFF]/20">
        <div className="text-sm text-white/60">Total HR Staff</div>
        <div className="text-2xl font-orbitron font-bold text-white">{data.hrList.length}</div>
      </div>
      <div className="p-4 bg-[#0A0E2A]/70 backdrop-blur-lg rounded-xl border border-[#00BFFF]/20">
        <div className="text-sm text-white/60">Total Job Openings</div>
        <div className="text-2xl font-orbitron font-bold text-white">{data.jobPostings.length}</div>
      </div>
      <div className="p-4 bg-[#0A0E2A]/70 backdrop-blur-lg rounded-xl border border-[#00BFFF]/20">
        <div className="text-sm text-white/60">Active Interviews</div>
        <div className="text-2xl font-orbitron font-bold text-white">{data.analytics.totalInterviews}</div>
      </div>
      <div className="p-4 bg-[#0A0E2A]/70 backdrop-blur-lg rounded-xl border border-[#00BFFF]/20">
        <div className="text-sm text-white/60">Avg AI Score</div>
        <div className="text-2xl font-orbitron font-bold text-white">{data.analytics.avgAIScore}%</div>
      </div>
    </div>
  );
};

export default SummaryCards;
