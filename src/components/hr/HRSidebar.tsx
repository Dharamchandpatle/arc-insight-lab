import { Bell, Calendar, LayoutDashboard, MessageSquare, Video } from 'lucide-react';
import React from 'react';
import { NavLink } from 'react-router-dom';

interface HRSidebarProps {
  collapsed: boolean;
}

const HRSidebar: React.FC<HRSidebarProps> = ({ collapsed }) => {
  const menuItems = [
    { to: '/hr', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/hr/interview-schedule', icon: Calendar, label: 'Interview Schedule' },
    { to: '/hr/ai-feedback', icon: MessageSquare, label: 'AI Feedback' },
    { to: '/hr/video-call', icon: Video, label: 'Video Call' },
    { to: '/hr/notifications', icon: Bell, label: 'Notifications' },
  ];

  return (
    <aside className={`fixed left-0 top-16 h-full bg-[#0A0E2A]/80 backdrop-blur-md border-r border-border/20 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-lg transition-all hover:bg-primary/10 ${
                    isActive ? 'bg-primary/20 text-primary' : 'text-muted-foreground'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default HRSidebar;