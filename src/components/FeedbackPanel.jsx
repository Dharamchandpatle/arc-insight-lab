import { MessageSquare, Star, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useCandidate } from '../context/CandidateContext';

const FeedbackPanel = () => {
  const { data, loading } = useCandidate();

  if (loading) {
    return (
      <div className="bg-[#0A0E2A]/70 backdrop-blur-lg rounded-xl p-6 border border-[#00BFFF]/20">
        <h3 className="text-xl font-bold text-white font-orbitron mb-4">AI Feedback</h3>
        <div className="space-y-4">
          {[1, 2].map(i => (
            <div key={i} className="animate-pulse p-4 bg-gray-700/50 rounded-lg">
              <div className="h-4 bg-gray-600 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-600 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const { aiFeedback } = data;

  const renderStars = (score) => {
    return Array.from({ length: 10 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < score ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
      />
    ));
  };

  return (
    <div className="bg-[#0A0E2A]/70 backdrop-blur-lg rounded-xl p-6 border border-[#00BFFF]/20 hover:shadow-[0_0_20px_#00BFFF] transition-all duration-300">
      <h3 className="text-xl font-bold text-white font-orbitron mb-6 flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-[#00BFFF]" />
        AI Feedback
      </h3>

      <div className="space-y-4">
        {aiFeedback.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No AI feedback available yet</p>
          </div>
        ) : (
          aiFeedback.map((feedback, index) => (
            <div
              key={index}
              className="p-4 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-lg border border-gray-600/50 hover:border-[#00BFFF]/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-3">
                <h4 className="font-semibold text-white text-sm leading-tight">
                  "{feedback.question}"
                </h4>
                <div className="flex items-center gap-1 ml-2">
                  {renderStars(feedback.score)}
                </div>
              </div>

              <p className="text-gray-300 text-sm mb-3 leading-relaxed">
                {feedback.feedback}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[#00BFFF] font-semibold text-sm">{feedback.score}/10</span>
                  <span className="text-gray-400 text-xs">AI Score</span>
                </div>
                <div className="flex items-center gap-1">
                  {feedback.score >= 8 ? (
                    <ThumbsUp className="w-4 h-4 text-green-400" />
                  ) : (
                    <ThumbsDown className="w-4 h-4 text-red-400" />
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {aiFeedback.length > 0 && (
        <div className="mt-6 p-4 bg-[#00BFFF]/10 rounded-lg border border-[#00BFFF]/20">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-[#00BFFF] font-semibold">Overall Performance</h4>
              <p className="text-gray-400 text-sm">Based on AI analysis</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-[#00BFFF] font-orbitron">
                {Math.round(aiFeedback.reduce((acc, curr) => acc + curr.score, 0) / aiFeedback.length * 10) / 10}/10
              </div>
              <div className="text-xs text-gray-400">Average Score</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackPanel;