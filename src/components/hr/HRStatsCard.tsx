import React from 'react';

interface HRStatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
}

const HRStatsCard: React.FC<HRStatsCardProps> = ({ title, value, icon, trend }) => {
  return (
    <div className="glass p-6 rounded-xl hover:glow-hover transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
          {trend && <p className="text-xs text-green-400">{trend}</p>}
        </div>
        <div className="text-primary">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default HRStatsCard;