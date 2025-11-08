import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from "recharts";
import { useCandidate } from "@/context/CandidateContext";

export const PerformanceGraph: React.FC = () => {
  const data = useCandidate();
  const labels = data.analytics.labels;

  const chartData = labels.map((label, i) => ({
    name: label,
    jdMatch: data.analytics.jdMatchTrend[i],
    communication: data.analytics.communicationTrend[i],
    feedback: data.analytics.feedbackTrend[i],
  }));

  return (
    <div className="glass p-4 rounded-xl">
      <h3 className="text-lg font-heading font-semibold mb-3">Performance Trends</h3>
      <div style={{ width: "100%", height: 220 }}>
        <ResponsiveContainer>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#0b1220" />
            <XAxis dataKey="name" tick={{ fill: '#9fbcd6' }} />
            <YAxis tick={{ fill: '#9fbcd6' }} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="jdMatch" stroke="#00bfff" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="communication" stroke="#7c3aed" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="feedback" stroke="#22c55e" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PerformanceGraph;
