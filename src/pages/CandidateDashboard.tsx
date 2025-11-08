import React, { useEffect, useRef } from "react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { CandidateProvider } from "@/context/CandidateContext";
import ProfileSection from "@/components/candidate/ProfileSection";
import StatsCard from "@/components/candidate/StatsCard";
import UpcomingInterviews from "@/components/candidate/UpcomingInterviews";
import InterviewHistory from "@/components/candidate/InterviewHistory";
import PerformanceGraph from "@/components/candidate/PerformanceGraph";
import FeedbackPanel from "@/components/candidate/FeedbackPanel";
import WaveAnimation from "@/components/candidate/WaveAnimation";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InterviewTab from "@/components/candidate/InterviewTab";

const CandidateDashboard: React.FC = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (contentRef.current) {
      gsap.from(contentRef.current.children, { y: 20, autoAlpha: 0, duration: 0.7, stagger: 0.08, ease: "power2.out" });
    }
  }, []);

  return (
    <CandidateProvider>
      <div className="min-h-screen">
        <Navbar showSearch />
        <Sidebar type="candidate" />

        <main className="ml-64 pt-24 pb-16">
          <div className="container mx-auto px-6" ref={contentRef}>
            <div className="mb-6">
              <h1 className="text-4xl font-heading font-bold mb-1">Candidate Dashboard</h1>
              <p className="text-muted-foreground">Overview of your interviews, feedback and performance</p>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="interview">Interview</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                  <div className="lg:col-span-2">
                    <ProfileSection onJoin={() => navigate('/interview')} />
                  </div>
                  <div className="space-y-4">
                    <StatsCard title="JD Match" value={`87%`} hint="Job description match" />
                    <StatsCard title="Communication" value={`82%`} hint="Speaking & clarity" />
                    <StatsCard title="Overall" value={`84%`} hint="Aggregated score" />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                  <div className="lg:col-span-2">
                    <PerformanceGraph />
                  </div>

                  <div className="space-y-4">
                    <UpcomingInterviews />
                    <div className="glass p-4 rounded-xl">
                      <h3 className="text-sm font-semibold">Live Wave</h3>
                      <WaveAnimation />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  <div className="lg:col-span-2">
                    <InterviewHistory />
                  </div>
                  <div>
                    <FeedbackPanel />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="interview">
                <InterviewTab />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </CandidateProvider>
  );
};

export default CandidateDashboard;
