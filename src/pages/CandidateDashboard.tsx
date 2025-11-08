import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Award, MessageSquare } from "lucide-react";
import candidateData from "@/mockData/candidateData.json";
import { useNavigate } from "react-router-dom";

const CandidateDashboard = () => {
  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const [countdown, setCountdown] = useState("2d 14h 30m");

  useEffect(() => {
    if (contentRef.current) {
      gsap.from(contentRef.current.children, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "power2.out",
      });
    }

    // Mock countdown timer
    const interval = setInterval(() => {
      // In a real app, calculate from candidateData.upcomingInterview.countdown
      setCountdown("2d 14h 29m");
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar showSearch />
      <Sidebar type="candidate" />
      
      <main className="ml-64 pt-24 pb-16">
        <div className="container mx-auto px-6" ref={contentRef}>
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold mb-2">Candidate Dashboard</h1>
            <p className="text-muted-foreground">Track your interviews and performance</p>
          </div>

          {/* Upcoming Interview */}
          <GlassCard glow className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-semibold flex items-center gap-2">
                <Calendar className="h-6 w-6 text-primary" />
                Upcoming Interview
              </h2>
              <div className="flex items-center gap-2 text-primary">
                <Clock className="h-5 w-5" />
                <span className="font-heading font-bold">{countdown}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Role:</span>
                <span className="font-semibold">{candidateData.upcomingInterview.role}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Company:</span>
                <span className="font-semibold">{candidateData.upcomingInterview.company}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date & Time:</span>
                <span className="font-semibold">
                  {candidateData.upcomingInterview.date} at {candidateData.upcomingInterview.time}
                </span>
              </div>
            </div>
            <Button 
              onClick={() => navigate("/interview")}
              className="w-full mt-6 bg-gradient-blue glow-hover"
            >
              Join Interview
            </Button>
          </GlassCard>

          {/* Live Analytics */}
          <GlassCard className="mb-8">
            <h2 className="text-2xl font-heading font-semibold mb-4">Live Interview Analytics</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-primary" />
                  Transcription
                </h3>
                <div className="glass p-4 rounded-lg max-h-32 overflow-y-auto text-sm text-muted-foreground">
                  {candidateData.liveAnalytics.transcription}
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold mb-2">AI Feedback</h3>
                <div className="glass p-4 rounded-lg text-sm">
                  {candidateData.liveAnalytics.feedback}
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold">JD Match</span>
                  <span className="text-sm font-bold text-primary">{candidateData.liveAnalytics.jdMatch}%</span>
                </div>
                <Progress value={candidateData.liveAnalytics.jdMatch} className="h-2" />
              </div>
            </div>
          </GlassCard>

          {/* Interview History */}
          <GlassCard>
            <h2 className="text-2xl font-heading font-semibold mb-6 flex items-center gap-2">
              <Award className="h-6 w-6 text-primary" />
              Interview History
            </h2>
            <div className="space-y-4">
              {candidateData.history.map((interview) => (
                <div key={interview.id} className="glass p-4 rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-heading font-semibold text-lg">{interview.role}</h3>
                      <p className="text-sm text-muted-foreground">{interview.company}</p>
                    </div>
                    <span className="text-sm text-muted-foreground">{interview.date}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground">Technical</p>
                      <p className="text-lg font-bold text-primary">{interview.technicalScore}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Communication</p>
                      <p className="text-lg font-bold text-primary">{interview.communicationScore}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">JD Match</p>
                      <p className="text-lg font-bold text-primary">{interview.jdMatch}%</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{interview.feedback}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
};

export default CandidateDashboard;
