import { Award, Calendar, User } from 'lucide-react';
import { useCandidate } from '../context/CandidateContext';

const ProfileSection = ({ onJoinInterview }) => {
  const { data, loading } = useCandidate();

  if (loading) {
    return (
      <div className="bg-[#0A0E2A]/70 backdrop-blur-lg rounded-xl p-6 border border-[#00BFFF]/20">
        <div className="animate-pulse">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 bg-gray-700 rounded-full"></div>
            <div className="space-y-2">
              <div className="h-6 bg-gray-700 rounded w-48"></div>
              <div className="h-4 bg-gray-700 rounded w-32"></div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="h-16 bg-gray-700 rounded"></div>
            <div className="h-16 bg-gray-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const { profile } = data;

  return (
    <div className="bg-[#0A0E2A]/70 backdrop-blur-lg rounded-xl p-6 border border-[#00BFFF]/20 hover:shadow-[0_0_20px_#00BFFF] transition-all duration-300">
      <div className="flex items-center gap-6 mb-6">
        <div className="relative">
          <div className="w-20 h-20 bg-gradient-to-br from-[#00BFFF] to-[#1E90FF] rounded-full flex items-center justify-center">
            <User className="w-10 h-10 text-white" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-black flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold text-white font-orbitron mb-1">{profile.name}</h2>
          <p className="text-[#00BFFF] font-semibold mb-2">{profile.role}</p>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1">
              <Award className="w-4 h-4" />
              {profile.level}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              Active Candidate
            </span>
          </div>
        </div>

        <button
          onClick={onJoinInterview}
          className="px-6 py-3 bg-gradient-to-r from-[#00BFFF] to-[#1E90FF] text-white font-semibold rounded-lg hover:shadow-[0_0_15px_#00BFFF] transition-all duration-300 hover:scale-105"
        >
          Join Interview
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center p-4 bg-[#00BFFF]/10 rounded-lg">
          <div className="text-2xl font-bold text-[#00BFFF] font-orbitron">{profile.jdMatch}%</div>
          <div className="text-sm text-gray-400">JD Match</div>
        </div>
        <div className="text-center p-4 bg-[#00BFFF]/10 rounded-lg">
          <div className="text-2xl font-bold text-[#00BFFF] font-orbitron">{profile.communication}%</div>
          <div className="text-sm text-gray-400">Communication</div>
        </div>
        <div className="text-center p-4 bg-[#00BFFF]/10 rounded-lg">
          <div className="text-2xl font-bold text-[#00BFFF] font-orbitron">{profile.overallScore}%</div>
          <div className="text-sm text-gray-400">Overall Score</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;