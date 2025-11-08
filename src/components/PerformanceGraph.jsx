import { BarChart3, TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useCandidate } from '../context/CandidateContext';

const PerformanceGraph = () => {
  const { data, loading } = useCandidate();

  if (loading) {
    return (
      <div className="bg-[#0A0E2A]/70 backdrop-blur-lg rounded-xl p-6 border border-[#00BFFF]/20">
        <h3 className="text-xl font-bold text-white font-orbitron mb-4">Performance Analytics</h3>
        <div className="animate-pulse">
          <div className="h-64 bg-gray-700/50 rounded-lg"></div>
        </div>
      </div>
    );
  }

  const { analytics } = data;

  // Prepare data for the chart
  const chartData = analytics.jdMatchTrend.map((jdMatch, index) => ({
    month: `Month ${index + 1}`,
    jdMatch,
    communication: analytics.communicationTrend[index],
    feedback: analytics.feedbackTrend[index]
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#0A0E2A] border border-[#00BFFF]/50 rounded-lg p-3 shadow-lg">
          <p className="text-[#00BFFF] font-semibold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-white" style={{ color: entry.color }}>
              {entry.name}: {entry.value}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-[#0A0E2A]/70 backdrop-blur-lg rounded-xl p-6 border border-[#00BFFF]/20 hover:shadow-[0_0_20px_#00BFFF] transition-all duration-300">
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="w-6 h-6 text-[#00BFFF]" />
        <h3 className="text-xl font-bold text-white font-orbitron">Performance Analytics</h3>
      </div>

      <div className="h-64 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="jdMatchGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00BFFF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00BFFF" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="communicationGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#1E90FF" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#1E90FF" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="feedbackGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4169E1" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#4169E1" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis
              dataKey="month"
              stroke="#888"
              fontSize={12}
            />
            <YAxis
              stroke="#888"
              fontSize={12}
              domain={[70, 90]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="jdMatch"
              stroke="#00BFFF"
              fillOpacity={1}
              fill="url(#jdMatchGradient)"
              strokeWidth={2}
              name="JD Match"
            />
            <Area
              type="monotone"
              dataKey="communication"
              stroke="#1E90FF"
              fillOpacity={1}
              fill="url(#communicationGradient)"
              strokeWidth={2}
              name="Communication"
            />
            <Area
              type="monotone"
              dataKey="feedback"
              stroke="#4169E1"
              fillOpacity={1}
              fill="url(#feedbackGradient)"
              strokeWidth={2}
              name="Feedback"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-[#00BFFF]/10 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">+7%</span>
          </div>
          <div className="text-[#00BFFF] font-semibold">JD Match</div>
          <div className="text-white font-orbitron text-lg">{analytics.jdMatchTrend[analytics.jdMatchTrend.length - 1]}%</div>
        </div>
        <div className="text-center p-3 bg-[#1E90FF]/10 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">+4%</span>
          </div>
          <div className="text-[#1E90FF] font-semibold">Communication</div>
          <div className="text-white font-orbitron text-lg">{analytics.communicationTrend[analytics.communicationTrend.length - 1]}%</div>
        </div>
        <div className="text-center p-3 bg-[#4169E1]/10 rounded-lg">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm">+9%</span>
          </div>
          <div className="text-[#4169E1] font-semibold">Feedback</div>
          <div className="text-white font-orbitron text-lg">{analytics.feedbackTrend[analytics.feedbackTrend.length - 1]}%</div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceGraph;