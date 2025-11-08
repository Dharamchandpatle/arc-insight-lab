import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { GlassCard } from "@/components/GlassCard";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import analyticsData from "@/mockData/analyticsData.json";
import { useTheme } from "@/contexts/ThemeContext";

const Analytics = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();

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

  const chartColors = {
    bar: theme === "dark" ? "#00BFFF" : "#1E90FF",
    grid: theme === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
    text: theme === "dark" ? "#E6E6E6" : "#222222",
  };

  return (
    <div className="min-h-screen">
      <Navbar showSearch />
      <Sidebar type="hr" />
      
      <main className="ml-64 pt-24 pb-16">
        <div className="container mx-auto px-6" ref={contentRef}>
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold mb-2">Analytics Dashboard</h1>
            <p className="text-muted-foreground">Comprehensive interview insights and candidate performance</p>
          </div>

          {/* Candidate Ranking Chart */}
          <GlassCard className="mb-8">
            <h2 className="text-2xl font-heading font-semibold mb-6">Candidate Rankings</h2>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={analyticsData.candidateRanking}>
                <CartesianGrid strokeDasharray="3 3" stroke={chartColors.grid} />
                <XAxis dataKey="name" stroke={chartColors.text} />
                <YAxis stroke={chartColors.text} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "rgba(10, 14, 42, 0.9)" : "rgba(255, 255, 255, 0.9)",
                    border: "1px solid rgba(0, 191, 255, 0.3)",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="score" fill={chartColors.bar} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </GlassCard>

          {/* Skills Analysis Radar */}
          <GlassCard>
            <h2 className="text-2xl font-heading font-semibold mb-6">Skills Analysis</h2>
            <ResponsiveContainer width="100%" height={400}>
              <RadarChart data={analyticsData.skillsAnalysis}>
                <PolarGrid stroke={chartColors.grid} />
                <PolarAngleAxis dataKey="skill" stroke={chartColors.text} />
                <PolarRadiusAxis stroke={chartColors.text} />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke={chartColors.bar}
                  fill={chartColors.bar}
                  fillOpacity={0.6}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === "dark" ? "rgba(10, 14, 42, 0.9)" : "rgba(255, 255, 255, 0.9)",
                    border: "1px solid rgba(0, 191, 255, 0.3)",
                    borderRadius: "8px",
                  }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </GlassCard>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
