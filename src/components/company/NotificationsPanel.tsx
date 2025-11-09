import React from 'react';
import { useCompany } from '../../contexts/CompanyContext';

const NotificationsPanel: React.FC = () => {
  const { data, markAllNotificationsRead } = useCompany();
  return (
    <div className="p-6 bg-[#0A0E2A]/70 backdrop-blur-lg rounded-xl border border-[#00BFFF]/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-orbitron font-bold text-[#00BFFF]">Notifications</h3>
        <button onClick={markAllNotificationsRead} className="btn-ghost">Mark All as Read</button>
      </div>
      <div className="space-y-3 max-h-48 overflow-auto">
        {data.notifications.map(n => (
          <div key={n.id} className={`p-3 rounded-lg ${n.read ? 'bg-white/3' : 'bg-blue-600/10'} flex items-start gap-3`}>
            <div className={`w-2 h-2 rounded-full mt-2 ${n.read ? 'bg-white/30' : 'bg-blue-400'}`} />
            <div className="text-sm text-white/80">{n.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationsPanel;
