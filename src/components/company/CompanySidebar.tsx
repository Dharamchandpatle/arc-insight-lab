import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const items = [
  { to: '/company', label: 'Dashboard' },
  { to: '/company/hr-list', label: 'HR List' },
  { to: '/company/job-postings', label: 'Job Postings' },
  { to: '/company/departments', label: 'Departments' },
  { to: '/company/analytics', label: 'Analytics' },
  { to: '/company/ai-insights', label: 'AI Insights' },
  { to: '/company/settings', label: 'Settings' },
];

const CompanySidebar: React.FC = () => {
  const [open, setOpen] = useState(true);
  return (
    <aside className={`bg-white/2 p-4 min-h-screen ${open ? 'w-56' : 'w-0 md:w-56'} transition-width`}>
      <div className="hidden md:block mb-6">
        <h4 className="text-white font-semibold">AI-NEXUS</h4>
      </div>
      <div className="flex flex-col gap-2">
        {items.map(i => (
          <NavLink key={i.to} to={i.to} className={({ isActive }) => `px-3 py-2 rounded text-sm ${isActive ? 'bg-[#00BFFF]/20 text-white shadow-[0_0_18px_#00BFFF]' : 'text-white/80 hover:bg-white/5'}`}>
            {i.label}
          </NavLink>
        ))}
      </div>
      <button className="mt-6 md:hidden btn-ghost" onClick={() => setOpen(s => !s)}>{open ? 'Collapse' : 'Open'}</button>
    </aside>
  );
};

export default CompanySidebar;
