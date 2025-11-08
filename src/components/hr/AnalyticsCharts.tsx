import React from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useHR } from '../../context/HRContext';

const AnalyticsCharts: React.FC = () => {
  const { analytics, candidateStats } = useHR();

  // Prepare data for charts
  const scoreData = [
    { name: 'JD Match', value: analytics.avgJDMatch },
    { name: 'Communication', value: analytics.avgCommScore },
    { name: 'AI Score', value: analytics.avgAIScore }
  ];

  const candidateChartData = candidateStats.map(candidate => ({
    name: candidate.name.split(' ')[0], // First name only
    jdMatch: candidate.jdMatch,
    communication: candidate.communication,
    aiScore: candidate.aiScore
  }));

  const pieData = [
    { name: 'JD Match', value: analytics.avgJDMatch, color: '#00BFFF' },
    { name: 'Communication', value: analytics.avgCommScore, color: '#1E90FF' },
    { name: 'AI Score', value: analytics.avgAIScore, color: '#4169E1' }
  ];

  return (
    <div className="glass p-6 rounded-xl">
      <h3 className="text-xl font-bold text-white mb-6">Analytics Dashboard</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Average Scores Bar Chart */}
        <div className="bg-white/5 p-4 rounded-lg">
          <h4 className="text-white font-medium mb-4">Average Scores</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={scoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="name" stroke="#ffffff80" />
              <YAxis stroke="#ffffff80" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0A0E2A',
                  border: '1px solid #00BFFF',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="value" fill="#00BFFF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Candidate Performance Line Chart */}
        <div className="bg-white/5 p-4 rounded-lg">
          <h4 className="text-white font-medium mb-4">Candidate Performance Trends</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={candidateChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
              <XAxis dataKey="name" stroke="#ffffff80" />
              <YAxis stroke="#ffffff80" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0A0E2A',
                  border: '1px solid #00BFFF',
                  borderRadius: '8px'
                }}
              />
              <Line type="monotone" dataKey="jdMatch" stroke="#00BFFF" strokeWidth={2} />
              <Line type="monotone" dataKey="communication" stroke="#1E90FF" strokeWidth={2} />
              <Line type="monotone" dataKey="aiScore" stroke="#4169E1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Score Distribution Pie Chart */}
        <div className="bg-white/5 p-4 rounded-lg">
          <h4 className="text-white font-medium mb-4">Score Distribution</h4>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0A0E2A',
                  border: '1px solid #00BFFF',
                  borderRadius: '8px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Key Metrics */}
        <div className="bg-white/5 p-4 rounded-lg">
          <h4 className="text-white font-medium mb-4">Key Metrics</h4>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/80">Total Interviews</span>
              <span className="text-white font-bold text-xl">{analytics.totalInterviews}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80">Avg JD Match</span>
              <span className="text-green-400 font-bold">{analytics.avgJDMatch}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80">Avg Communication</span>
              <span className="text-blue-400 font-bold">{analytics.avgCommScore}%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/80">Avg AI Score</span>
              <span className="text-purple-400 font-bold">{analytics.avgAIScore}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsCharts;