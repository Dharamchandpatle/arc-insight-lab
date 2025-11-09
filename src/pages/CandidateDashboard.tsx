import gsap from "gsap";
import { Award, MessageSquare, Target, TrendingUp } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import FeedbackPanel from "../components/FeedbackPanel";
import InterviewHistory from "../components/InterviewHistory";
import PerformanceGraph from "../components/PerformanceGraph";
import ProfileSection from "../components/ProfileSection";
import StatsCard from "../components/StatsCard";
import UpcomingInterviews from "../components/UpcomingInterviews";
import WaveBackground from "../components/WaveBackground";
import { CandidateProvider } from "../context/CandidateContext";

const CandidateDashboard = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (contentRef.current) {
      gsap.from(contentRef.current.children, {
        y: 20,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power2.out"
      });
    }
  }, []);

  const handleJoinInterview = () => {
    navigate('/interview3d');
  };

  return (
    <CandidateProvider>
      <div className="min-h-screen bg-gradient-to-b from-[#0A0E2A] to-black text-white relative overflow-hidden">
        <WaveBackground />

        <div className="relative z-10">
          {/* Header */}
          <header className="border-b border-[#00BFFF]/20 bg-[#0A0E2A]/80 backdrop-blur-lg">
            <div className="container mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold font-orbitron bg-gradient-to-r from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent">
                    AI-NEXUS
                  </h1>
                  <p className="text-gray-400 text-sm">Candidate Dashboard</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-400">Welcome back,</p>
                    <p className="font-semibold text-[#00BFFF]">Neha Sharma</p>
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-br from-[#00BFFF] to-[#1E90FF] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">N</span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-6 py-8" ref={contentRef}>
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold font-orbitron mb-4 bg-gradient-to-r from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent">
                Your Interview Journey
              </h2>
              <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                Track your progress, analyze performance, and prepare for success with AI-powered insights
              </p>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <StatsCard
                title="JD Match"
                value="87%"
                hint="Job description alignment"
                trend={5}
                icon={Target}
              />
              <StatsCard
                title="Communication"
                value="82%"
                hint="Speaking & clarity"
                trend={3}
                icon={MessageSquare}
              />
              <StatsCard
                title="Overall Score"
                value="84%"
                hint="Aggregated performance"
                trend={7}
                icon={Award}
              />
              <StatsCard
                title="Interviews"
                value="12"
                hint="Completed this month"
                trend={15}
                icon={TrendingUp}
              />
            </div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Left Column - Profile & Upcoming */}
              <div className="lg:col-span-2 space-y-8">
                <ProfileSection onJoin={handleJoinInterview} />
                <UpcomingInterviews />
              </div>

              {/* Right Column - Quick Stats */}
              <div className="space-y-8">
                <div className="bg-[#0A0E2A]/70 backdrop-blur-lg rounded-xl p-6 border border-[#00BFFF]/20">
                  <h3 className="text-xl font-bold font-orbitron mb-4 text-[#00BFFF]">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={handleJoinInterview}
                      className="w-full px-4 py-3 bg-gradient-to-r from-[#00BFFF] to-[#1E90FF] text-white font-semibold rounded-lg hover:shadow-[0_0_15px_#00BFFF] transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <Target className="w-5 h-5" />
                      Start Practice Interview
                    </button>
                    <button className="w-full px-4 py-3 bg-[#00BFFF]/20 text-[#00BFFF] font-semibold rounded-lg hover:bg-[#00BFFF]/30 transition-all duration-300 border border-[#00BFFF]/30">
                      View Resume
                    </button>
                    <button onClick={() => navigate('/practice')} className="w-full px-4 py-3 bg-[#00BFFF]/20 text-[#00BFFF] font-semibold rounded-lg hover:bg-[#00BFFF]/30 transition-all duration-300 border border-[#00BFFF]/30">
                      Practice Questions
                    </button>
                  </div>
                </div>

                <div className="bg-[#0A0E2A]/70 backdrop-blur-lg rounded-xl p-6 border border-[#00BFFF]/20">
                  <h3 className="text-xl font-bold font-orbitron mb-4 text-[#00BFFF]">Today's Focus</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-[#00BFFF]/10 rounded-lg">
                      <div className="w-2 h-2 bg-[#00BFFF] rounded-full"></div>
                      <span className="text-sm">Improve communication skills</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#00BFFF]/10 rounded-lg">
                      <div className="w-2 h-2 bg-[#00BFFF] rounded-full"></div>
                      <span className="text-sm">Practice technical questions</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-[#00BFFF]/10 rounded-lg">
                      <div className="w-2 h-2 bg-[#00BFFF] rounded-full"></div>
                      <span className="text-sm">Review feedback reports</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Analytics & History */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <PerformanceGraph />
              <InterviewHistory />
            </div>

            {/* AI Feedback */}
            <div className="mb-8">
              <FeedbackPanel />
            </div>

            {/* Footer */}
            <footer className="text-center py-8 border-t border-[#00BFFF]/20">
              <p className="text-gray-400">
                Powered by <span className="text-[#00BFFF] font-orbitron">AI-NEXUS</span> •
                Built for interview success
              </p>
            </footer>
          </main>
        </div>
      </div>
    </CandidateProvider>
  );
};

export default CandidateDashboard;
