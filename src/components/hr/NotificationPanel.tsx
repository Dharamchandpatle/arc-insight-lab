import { AlertCircle, Bell, Calendar, FileText, User } from 'lucide-react';
import React from 'react';

const NotificationPanel: React.FC = () => {
  const notifications = [
    {
      id: 1,
      type: 'interview',
      title: 'Interview Scheduled',
      message: 'Interview with Sarah Johnson scheduled for tomorrow at 2:00 PM',
      time: '2 hours ago',
      icon: Calendar,
      color: 'text-blue-400'
    },
    {
      id: 2,
      type: 'candidate',
      title: 'New Application',
      message: 'Mike Chen applied for Senior Developer position',
      time: '4 hours ago',
      icon: User,
      color: 'text-green-400'
    },
    {
      id: 3,
      type: 'system',
      title: 'JD Review Required',
      message: 'Frontend Developer JD needs review - low match rate detected',
      time: '1 day ago',
      icon: FileText,
      color: 'text-yellow-400'
    },
    {
      id: 4,
      type: 'alert',
      title: 'Interview Reminder',
      message: 'Upcoming interview with Alex Rodriguez in 30 minutes',
      time: '30 min ago',
      icon: AlertCircle,
      color: 'text-red-400'
    }
  ];

  return (
    <div className="glass p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Notifications</h3>
        <Bell className="text-primary" size={24} />
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div key={notification.id} className="bg-white/5 p-4 rounded-lg hover:bg-white/10 transition-colors">
            <div className="flex items-start gap-3">
              <notification.icon className={`${notification.color} mt-1`} size={20} />
              <div className="flex-1">
                <h4 className="text-white font-medium mb-1">{notification.title}</h4>
                <p className="text-white/70 text-sm mb-2">{notification.message}</p>
                <p className="text-white/40 text-xs">{notification.time}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-8">
          <Bell className="text-primary mx-auto mb-4" size={48} />
          <p className="text-white/60">No new notifications</p>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;