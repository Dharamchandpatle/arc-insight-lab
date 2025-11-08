import AnimatedBg from "@/components/AnimatedBg";
import { GlassCard } from "@/components/GlassCard";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Interview, getAnalytics, getChartData, getInterviews, saveAnalytics, saveInterviews } from "@/data/hrData";
import gsap from "gsap";
import { Eye, FileCheck, Search, Trash2, TrendingUp, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";

const HRDashboard = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<HTMLDivElement>(null);
  const [interviews, setInterviews] = useState<Interview[]>(() => getInterviews());
  const [searchTerm, setSearchTerm] = useState("");
  const [analytics, setAnalytics] = useState(() => getAnalytics());
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const chartData = getChartData();

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
    if (chartRef.current) {
      gsap.from(chartRef.current.children, {
        scale: 0.8,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "back.out(1.7)",
      });
    }
  }, []);

  const handleDeleteInterview = (id: number) => {
    const updated = interviews.filter((interview) => interview.id !== id);
    setInterviews(updated);
    saveInterviews(updated);

    const updatedAnalytics = { ...analytics, feedbackReports: Math.max(0, analytics.feedbackReports - 1) };
    setAnalytics(updatedAnalytics);
    saveAnalytics(updatedAnalytics);
    toast.success("Interview deleted");
  };

  const handleStatusToggle = (id: number) => {
    const updated = interviews.map((interview) =>
      interview.id === id
        ? { ...interview, status: interview.status === "Scheduled" ? "Completed" : "Scheduled" }
        : interview
    );
    setInterviews(updated);
    saveInterviews(updated);
    toast.info("Interview status updated");
  };

  const filteredInterviews = interviews.filter(interview =>
    interview.candidate.toLowerCase().includes(searchTerm.toLowerCase()) ||
    interview.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const COLORS = ['#00BFFF', '#1E90FF', '#4169E1', '#0000CD', '#000080'];

  return (
    <div className="min-h-screen">
      <Navbar showSearch onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <Sidebar type="hr" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />
      
      <main className={`relative pt-24 pb-16 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} md:${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <AnimatedBg />
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
                  <p className="text-2xl font-heading font-bold">{analytics.topCandidate}</p>
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
                  <p className="text-2xl font-heading font-bold">{analytics.avgJDMatch}%</p>
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
                  <p className="text-2xl font-heading font-bold">{analytics.feedbackReports}</p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Charts */}
          <div ref={chartRef} className="grid md:grid-cols-2 gap-8 mb-8">
            <GlassCard>
              <h2 className="text-2xl font-heading font-semibold mb-6">Candidate JD Match Scores</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData.jdMatchScores}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 191, 255, 0.2)" />
                  <XAxis dataKey="name" stroke="#E6E6E6" />
                  <YAxis stroke="#E6E6E6" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(10, 14, 42, 0.9)",
                      border: "1px solid rgba(0, 191, 255, 0.3)",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="score" fill="#00BFFF" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>

            <GlassCard>
              <h2 className="text-2xl font-heading font-semibold mb-6">Skill Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={chartData.skillDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {chartData.skillDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>

          {/* Skills Analysis (Radar) */}
          <div className="mb-8">
            <GlassCard>
              <h2 className="text-2xl font-heading font-semibold mb-6">Skills Analysis</h2>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={chartData.skillDistribution.map(d => ({ skill: d.name, score: d.value }))}>
                  <PolarGrid stroke="rgba(0, 191, 255, 0.12)" />
                  <PolarAngleAxis dataKey="skill" stroke="#E6E6E6" />
                  <PolarRadiusAxis stroke="#E6E6E6" />
                  <Radar name="Skill" dataKey="score" stroke="#00BFFF" fill="#00BFFF" fillOpacity={0.6} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </GlassCard>
          </div>

          {/* Upcoming Interviews Table */}
          <GlassCard>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-heading font-semibold">Upcoming Interviews</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search candidates..."
                  className="pl-10 glass w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-heading font-semibold">Candidate</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold">Role</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold">Date</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold">Time</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-heading font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInterviews.map((interview) => (
                    <tr key={interview.id} className="border-b border-border/50 hover:bg-accent/50 transition-colors">
                      <td className="py-3 px-4">{interview.candidate}</td>
                      <td className="py-3 px-4 text-muted-foreground">{interview.role}</td>
                      <td className="py-3 px-4 text-muted-foreground">{interview.date}</td>
                      <td className="py-3 px-4 text-muted-foreground">{interview.time}</td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleStatusToggle(interview.id)}
                          className={`px-3 py-1 rounded-full text-sm font-semibold transition-all hover:scale-105 ${
                            interview.status === "Completed"
                              ? "bg-primary/20 text-primary"
                              : "bg-secondary/20 text-secondary"
                          }`}
                        >
                          {interview.status}
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => toast.info(`Viewing details for ${interview.candidate}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteInterview(interview.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredInterviews.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No interviews found
                </div>
              )}
            </div>
          </GlassCard>
        </div>
      </main>
    </div>
  );
};

export default HRDashboard;
