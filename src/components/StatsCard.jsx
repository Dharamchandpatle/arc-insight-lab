import { TrendingDown, TrendingUp } from 'lucide-react';

const StatsCard = ({ title, value, hint, trend, icon: Icon }) => {
  const isPositive = trend > 0;

  return (
    <div className="bg-[#0A0E2A]/70 backdrop-blur-lg rounded-xl p-6 border border-[#00BFFF]/20 hover:shadow-[0_0_20px_#00BFFF] transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <div className="p-3 bg-[#00BFFF]/10 rounded-lg">
          {Icon && <Icon className="w-6 h-6 text-[#00BFFF]" />}
        </div>
        {trend !== undefined && trend !== null && (
          <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>

      <div className="space-y-2">
        <h3 className="text-2xl font-bold text-white font-orbitron">{value}</h3>
        <p className="text-[#00BFFF] font-semibold">{title}</p>
        {hint && <p className="text-gray-400 text-sm">{hint}</p>}
      </div>
    </div>
  );
};

export default StatsCard;