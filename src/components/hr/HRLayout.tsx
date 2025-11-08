import { Menu } from 'lucide-react';
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Button } from '../ui/button';
import HRSidebar from './HRSidebar';

const HRLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const sidebarWidthClass = collapsed ? 'ml-16' : 'ml-64';

  return (
    <div className="relative min-h-screen">
      <HRSidebar collapsed={collapsed} />

      <main className={`${sidebarWidthClass} transition-margin duration-300 p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">HR</h1>
          <Button size="sm" variant="ghost" onClick={() => setCollapsed(s => !s)}>
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        <Outlet />
      </main>
    </div>
  );
};

export default HRLayout;