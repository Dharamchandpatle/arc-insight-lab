import React from 'react';
import { Outlet } from 'react-router-dom';
import WaveBackground from '../WaveBackground';
import CompanySidebar from './CompanySidebar';

const CompanyLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0E2A] to-black text-white relative overflow-hidden">
      <WaveBackground />
      <div className="relative z-10">
        <div className="container mx-auto px-6 py-8">
          <div className="flex">
            <CompanySidebar />
            <main className="flex-1 pl-6 space-y-6">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyLayout;
