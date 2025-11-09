import React, { useMemo, useState } from 'react';
import { Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useCompany } from '../../contexts/CompanyContext';

const InterviewAnalytics: React.FC = () => {
  const { data, regenerateAI } = useCompany();
  const [secondaryMetric, setSecondaryMetric] = useState<'jdMatch' | 'candidateGrowth'>('jdMatch');

  // Prepare line chart data from analytics arrays
  const lineData = useMemo(() => {
    const interviews = data.analytics.interviewTrend || [];
    const jd = data.analytics.candidateGrowth || [];
    return interviews.map((v: number, i: number) => ({
      name: `W${i + 1}`,
      interviews: v,
      jdMatch: jd[i] ?? 0,
    }));
  }, [data.analytics]);

  // Pie chart derived from job postings statuses so it reflects real data
  const pieData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.jobPostings.forEach(j => { counts[j.status] = (counts[j.status] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data.jobPostings]);

  const COLORS = ['#00BFFF', '#FFD166', '#F87060', '#7C3AED', '#06b6d4'];

  const totalInterviews = useMemo(() => (data.analytics.interviewTrend || []).reduce((s, v) => s + v, 0), [data.analytics]);

  return (
    <div className="glass p-6 rounded-xl">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-white">Interview Analytics</h3>
          <div className="text-sm text-white/60">Key metrics and trends for interviews and JD alignment</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-sm text-white/60">Total Interviews</div>
            <div className="text-lg font-semibold">{totalInterviews}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/60">Avg JD Match</div>
            <div className="text-lg font-semibold">{data.analytics.avgJDMatch}%</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/60">Avg AI Score</div>
            <div className="text-lg font-semibold">{data.analytics.avgAIScore}%</div>
          </div>
          <button onClick={regenerateAI} className="btn-ghost">Regenerate AI</button>
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <label className="text-sm text-white/60">Secondary metric:</label>
        <select value={secondaryMetric} onChange={e => setSecondaryMetric(e.target.value as any)} className="input-field">
          <option value="jdMatch">JD Match</option>
          <option value="candidateGrowth">Candidate Growth</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData}>
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip />
              <Line type="monotone" dataKey="interviews" stroke="#00BFFF" strokeWidth={2} name="Interviews" />
              <Line
                type="monotone"
                dataKey={secondaryMetric === 'jdMatch' ? 'jdMatch' : 'jdMatch'}
                stroke={secondaryMetric === 'jdMatch' ? '#7C3AED' : '#06b6d4'}
                strokeWidth={2}
                name={secondaryMetric === 'jdMatch' ? 'JD Match' : 'Candidate Growth'}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ height: 280 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" outerRadius={90} fill="#8884d8" label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default InterviewAnalytics;
