import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Users, FileCheck, TrendingUp } from "lucide-react";
import hrData from "@/mockData/hrData.json";

const HRDashboard = () => {
  const contentRef = useRef<HTMLDivElement>(null);

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
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar showSearch />
      <Sidebar type="hr" />
      
      <main className="ml-64 pt-24 pb-16">
        <div className="container mx-auto px-6" ref={contentRef}>
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold mb-2">HR Dashboard</h1>
            <p className="text-muted-foreground">Manage interviews and analyze candidates</p>
          </div>

          {/* Analytics Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <GlassCard glow>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/20">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Top Candidate</p>
                  <p className="text-2xl font-heading font-bold">{hrData.analytics.topCandidate}</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard glow>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/20">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average JD Match</p>
                  <p className="text-2xl font-heading font-bold">{hrData.analytics.avgJDMatch}%</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard glow>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/20">
                  <FileCheck className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Feedback Reports</p>
                  <p className="text-2xl font-heading font-bold">{hrData.analytics.feedbackReports}</p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* JD Upload Form */}
          <GlassCard className="mb-8">
            <h2 className="text-2xl font-heading font-semibold mb-4 flex items-center gap-2">
              <Upload className="h-6 w-6 text-primary" />
              Upload Job Description
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="role">Role Title</Label>
                <Input id="role" placeholder="e.g., Frontend Developer" className="glass" />
              </div>
              <div>
                <Label htmlFor="jd">Job Description</Label>
                <textarea
                  id="jd"
                  rows={6}
                  placeholder="Paste the job description here..."
                  className="w-full px-3 py-2 glass rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <Button className="bg-gradient-blue glow-hover">
                Submit JD
              </Button>
            </div>
          </GlassCard>

          {/* Upcoming Interviews Table */}
          <GlassCard>
            <h2 className="text-2xl font-heading font-semibold mb-6">Upcoming Interviews</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-heading font-semibold">Candidate</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold">Role</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold">Date</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold">Time</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {hrData.upcomingInterviews.map((interview) => (
                    <tr key={interview.id} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                      <td className="py-3 px-4">{interview.candidate}</td>
                      <td className="py-3 px-4 text-muted-foreground">{interview.role}</td>
                      <td className="py-3 px-4 text-muted-foreground">{interview.date}</td>
                      <td className="py-3 px-4 text-muted-foreground">{interview.time}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            interview.status === "Completed"
                              ? "bg-primary/20 text-primary"
                              : "bg-secondary/20 text-secondary"
                          }`}
                        >
                          {interview.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
};

export default HRDashboard;
