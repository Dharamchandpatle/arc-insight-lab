import React, { useMemo } from 'react';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useCompany } from '../../contexts/CompanyContext';

const DepartmentPerformance: React.FC = () => {
  const { data } = useCompany();
  const chartData = useMemo(() => data.departments.map(d => ({ name: d.name, total: d.totalPositions, filled: d.filled })), [data.departments]);

  return (
    <div className="glass p-6 rounded-xl">
      <h3 className="text-xl font-bold text-white mb-4">Department Performance</h3>
      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip />
            <Bar dataKey="total" fill="#0ea5e9" />
            <Bar dataKey="filled" fill="#06b6d4">
              {chartData.map((entry, idx) => (
                <Cell key={idx} fill={entry.filled / entry.total > 0.8 ? '#10b981' : '#f59e0b'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default DepartmentPerformance;
