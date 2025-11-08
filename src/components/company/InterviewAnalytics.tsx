import React from 'react';
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useCompany } from '../../contexts/CompanyContext';

const InterviewAnalytics: React.FC = () => {
  const { data } = useCompany();
  const lineData = data.analytics.interviewTrend.map((v, i) => ({ name: `W${i + 1}`, interviews: v, jdMatch: data.analytics.candidateGrowth[i] ?? 0 }));
  const pieData = [
    { name: 'Open', value: 40 },
    { name: 'Screening', value: 30 },
    { name: 'Closed', value: 30 },
  ];

  const COLORS = ['#00BFFF', '#FFD166', '#F87060'];

  return (
    <div className="glass p-6 rounded-xl">
      <h3 className="text-xl font-bold text-white mb-4">Interview Analytics</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Line type="monotone" dataKey="interviews" stroke="#00BFFF" strokeWidth={2} />
              <Line type="monotone" dataKey="jdMatch" stroke="#7C3AED" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ height: 240 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={80} fill="#8884d8" label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default InterviewAnalytics;
