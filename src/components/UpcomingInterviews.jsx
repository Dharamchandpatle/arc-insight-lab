import { Building, Calendar, Clock, Video } from 'lucide-react';
import { useCandidate } from '../context/CandidateContext';

const UpcomingInterviews = () => {
  const { data, loading } = useCandidate();

  if (loading) {
    return (
      <div className="bg-[#0A0E2A]/70 backdrop-blur-lg rounded-xl p-6 border border-[#00BFFF]/20">
        <h3 className="text-xl font-bold text-white font-orbitron mb-4">Upcoming Interviews</h3>
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

  const { upcomingInterviews } = data;

  return (
    <div className="bg-[#0A0E2A]/70 backdrop-blur-lg rounded-xl p-6 border border-[#00BFFF]/20 hover:shadow-[0_0_20px_#00BFFF] transition-all duration-300">
      <h3 className="text-xl font-bold text-white font-orbitron mb-6 flex items-center gap-2">
        <Calendar className="w-6 h-6 text-[#00BFFF]" />
        Upcoming Interviews
      </h3>

      <div className="space-y-4">
        {upcomingInterviews.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No upcoming interviews scheduled</p>
          </div>
        ) : (
          upcomingInterviews.map((interview) => (
            <div
              key={interview.id}
              className="p-4 bg-gradient-to-r from-[#00BFFF]/10 to-[#1E90FF]/10 rounded-lg border border-[#00BFFF]/20 hover:border-[#00BFFF]/40 transition-all duration-300 hover:scale-102"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-white flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#00BFFF]" />
                    {interview.company}
                  </h4>
                  <p className="text-[#00BFFF] text-sm">{interview.role}</p>
                </div>
                <button className="px-3 py-1 bg-[#00BFFF]/20 text-[#00BFFF] rounded-lg hover:bg-[#00BFFF]/30 transition-colors flex items-center gap-1 text-sm">
                  <Video className="w-3 h-3" />
                  Join
                </button>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(interview.date).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {interview.time}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UpcomingInterviews;