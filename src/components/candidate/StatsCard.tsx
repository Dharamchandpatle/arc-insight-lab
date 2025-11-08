import React from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  hint?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, hint }) => {
  return (
    <div className="glass p-4 rounded-xl">
      <div className="text-sm text-muted-foreground">{title}</div>
      <div className="text-2xl font-heading font-bold text-sky-200">{value}</div>
      {hint && <div className="text-xs text-muted-foreground mt-2">{hint}</div>}
    </div>
  );
};

export default StatsCard;
