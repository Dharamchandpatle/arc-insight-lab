import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/company', label: 'Dashboard' },
  { to: '/company/hr-list', label: 'HR List' },
  { to: '/company/job-postings', label: 'Job Postings' },
  { to: '/company/ai-insights', label: 'AI Insights' },
  { to: '/company/settings', label: 'Settings' },
];

const CompanySidebar: React.FC = () => {
  const [open, setOpen] = useState(true);
  return (
    <aside className={`p-6 min-h-screen ${open ? 'w-64' : 'w-0 md:w-64'} transition-width sticky top-6 self-start` } style={{ background: 'linear-gradient(180deg, rgba(6,10,30,0.9), rgba(4,6,20,0.85))' }}>
      <div className="hidden md:block mb-6">
        <h4 className="text-white font-orbitron text-lg font-semibold">AI-NEXUS</h4>
      </div>
      <div className="flex flex-col gap-3">
        {items.map(i => (
          <NavLink key={i.to} to={i.to} className={({ isActive }) => `group relative overflow-hidden p-1 rounded-lg` }>
            {({ isActive }) => (
              <div className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all ${isActive ? 'bg-[#022433] text-white' : 'text-white/80 hover:bg-white/5'}`}>
                <div className={`flex-1 text-sm ${isActive ? 'font-semibold' : ''}`}>{i.label}</div>
                {isActive && <div className="absolute inset-0 rounded-lg shadow-[0_0_20px_rgba(0,191,255,0.35)]" style={{ pointerEvents: 'none' }} />}
              </div>
            )}
          </NavLink>
        ))}
      </div>
      <div className="mt-6 md:hidden">
        <button className="btn-ghost" onClick={() => setOpen(s => !s)}>{open ? 'Collapse' : 'Open'}</button>
      </div>
    </aside>
  );
};

export default CompanySidebar;
