import { Brain, MessageSquare, TrendingUp, User } from 'lucide-react';
import React from 'react';
import { useHR } from '../../context/HRContext';

const CandidateTable: React.FC = () => {
  const { candidateStats } = useHR();

  return (
    <div className="glass p-6 rounded-xl">
      <h3 className="text-xl font-bold text-white mb-6">Candidate Performance</h3>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20">
              <th className="text-left py-3 px-4 text-white font-medium">Candidate</th>
              <th className="text-center py-3 px-4 text-white font-medium">JD Match</th>
              <th className="text-center py-3 px-4 text-white font-medium">Communication</th>
              <th className="text-center py-3 px-4 text-white font-medium">AI Score</th>
              <th className="text-center py-3 px-4 text-white font-medium">Overall</th>
            </tr>
          </thead>
          <tbody>
            {candidateStats.map((candidate, index) => {
              const overall = Math.round((candidate.jdMatch + candidate.communication + candidate.aiScore) / 3);
              return (
                <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <User className="text-primary" size={20} />
                      <span className="text-white font-medium">{candidate.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <TrendingUp size={16} className="text-green-400" />
                      <span className="text-white">{candidate.jdMatch}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <MessageSquare size={16} className="text-blue-400" />
                      <span className="text-white">{candidate.communication}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <Brain size={16} className="text-purple-400" />
                      <span className="text-white">{candidate.aiScore}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      overall >= 80 ? 'bg-green-500/20 text-green-400' :
                      overall >= 60 ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {overall}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CandidateTable;