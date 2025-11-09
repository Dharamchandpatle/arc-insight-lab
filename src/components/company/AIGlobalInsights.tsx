import React from 'react';
import { Brain } from 'lucide-react';
import InterviewHistoryList from '../InterviewHistoryList';

const AIGlobalInsights: React.FC = () => {
  return (
    <div className="p-6 bg-[#07102A]/70 backdrop-blur-lg rounded-xl border border-[#7C3AED]/20">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-6 h-6 text-[#7C3AED]" />
        <h3 className="text-2xl font-orbitron font-bold text-[#7C3AED]">AI Insights</h3>
      </div>
      
      {/* Information about interview data */}
      <div className="mb-6 p-4 bg-[#7C3AED]/10 border border-[#7C3AED]/30 rounded-lg">
        <h4 className="text-sm font-semibold text-[#7C3AED] mb-2 flex items-center gap-2">
          <Brain className="w-4 h-4" />
          Interview Data Overview
        </h4>
        <div className="space-y-2 text-sm text-white/80">
          <div className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            <div>
              <strong>All Interviews:</strong> View all interviews conducted by your HR team members.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            <div>
              <strong>AI Reports:</strong> Access comprehensive AI analysis reports for each interview, including scores, feedback, and Q&A breakdowns.
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-green-400">✓</span>
            <div>
              <strong>Transcripts:</strong> Review full interview transcripts and conversations.
            </div>
          </div>
        </div>
      </div>

      {/* Interview History List - shows all interviews from all HRs */}
      <div>
        <InterviewHistoryList role="company" />
      </div>
    </div>
  );
};

export default AIGlobalInsights;
