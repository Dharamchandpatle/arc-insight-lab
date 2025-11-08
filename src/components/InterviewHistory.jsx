import { Building, Calendar, CheckCircle, Clock, History } from 'lucide-react';
import { useCandidate } from '../context/CandidateContext';

const InterviewHistory = () => {
  const { data, loading } = useCandidate();

  if (loading) {
    return (
      <div className="bg-[#0A0E2A]/70 backdrop-blur-lg rounded-xl p-6 border border-[#00BFFF]/20">
        <h3 className="text-xl font-bold text-white font-orbitron mb-4">Interview History</h3>
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="animate-pulse p-4 bg-gray-700/50 rounded-lg">
              <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-600 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { history } = data;

  const getResultColor = (result) => {
    switch (result.toLowerCase()) {
      case 'shortlisted': return 'text-green-400';
      case 'pending': return 'text-yellow-400';
      case 'rejected': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getResultIcon = (result) => {
    switch (result.toLowerCase()) {
      case 'shortlisted': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return <History className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-[#0A0E2A]/70 backdrop-blur-lg rounded-xl p-6 border border-[#00BFFF]/20 hover:shadow-[0_0_20px_#00BFFF] transition-all duration-300">
      <h3 className="text-xl font-bold text-white font-orbitron mb-6 flex items-center gap-2">
        <History className="w-6 h-6 text-[#00BFFF]" />
        Interview History
      </h3>

      <div className="space-y-4">
        {history.length === 0 ? (
          <div className="text-center py-8">
            <History className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No interview history available</p>
          </div>
        ) : (
          history.map((interview) => (
            <div
              key={interview.id}
              className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg border border-gray-600/50 hover:border-[#00BFFF]/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#00BFFF]" />
                    {interview.company}
                  </h4>
                  <p className="text-gray-400 text-sm flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(interview.date).toLocaleDateString()}
                  </p>
                </div>
                <div className={`flex items-center gap-1 text-sm ${getResultColor(interview.result)}`}>
                  {getResultIcon(interview.result)}
                  {interview.result}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center p-3 bg-[#00BFFF]/10 rounded-lg">
                  <div className="text-lg font-bold text-[#00BFFF] font-orbitron">{interview.feedbackScore}</div>
                  <div className="text-xs text-gray-400">Feedback</div>
                </div>
                <div className="text-center p-3 bg-[#00BFFF]/10 rounded-lg">
                  <div className="text-lg font-bold text-[#00BFFF] font-orbitron">{interview.jdMatch}%</div>
                  <div className="text-xs text-gray-400">JD Match</div>
                </div>
                <div className="text-center p-3 bg-[#00BFFF]/10 rounded-lg">
                  <div className="text-lg font-bold text-[#00BFFF] font-orbitron">{interview.communication}%</div>
                  <div className="text-xs text-gray-400">Communication</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InterviewHistory;