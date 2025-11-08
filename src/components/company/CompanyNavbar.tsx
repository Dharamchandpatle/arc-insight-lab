import gsap from 'gsap';
import { Bell, LogOut, SunMoon } from 'lucide-react';
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';

const CompanyNavbar: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const { data } = useCompany();
  const navigate = useNavigate();

  useEffect(() => {
    if (ref.current) gsap.from(ref.current, { opacity: 0, y: -10, duration: 0.6 });
  }, []);

  return (
    <header ref={ref} className="flex items-center justify-between px-6 py-3 bg-white/5 backdrop-blur border-b border-b-[#00BFFF]/30">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-primary/20 rounded flex items-center justify-center text-primary font-bold">AI</div>
        <div>
          <div className="text-white font-semibold">{data.profile.companyName}</div>
          <div className="text-xs text-white/50">{data.profile.head}</div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/company')} className="hidden sm:inline-block px-3 py-1 rounded bg-white/5 hover:bg-white/10 text-sm">Dashboard</button>
        <div className="hidden md:block">
          <input className="input-field px-3" placeholder="Search people or jobs..." />
        </div>
        <button className="p-2 rounded hover:bg-white/5">
          <Bell className="text-white/80" />
        </button>
        <button className="p-2 rounded hover:bg-white/5">
          <SunMoon className="text-white/80" />
        </button>
        <button className="p-2 rounded hover:bg-white/5">
          <LogOut className="text-white/80" />
        </button>
      </div>
    </header>
  );
};

export default CompanyNavbar;
