import { GlassCard } from "@/components/GlassCard";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getInterviews, Interview, saveInterviews } from "@/data/hrData";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const InterviewScheduling = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [interviews, setInterviews] = useState<Interview[]>(() => getInterviews());
  const [candidate, setCandidate] = useState("");
  const [role, setRole] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  useEffect(() => {
    setInterviews(getInterviews());
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidate || !role || !date) return toast.error("Please fill candidate, role and date");
    const newItem: Interview = {
      id: Date.now(),
      candidate,
      role,
      date,
      time,
      status: "Scheduled",
    };
    const updated = [newItem, ...interviews];
    setInterviews(updated);
    saveInterviews(updated);
    setCandidate("");
    setRole("");
    setDate("");
    setTime("");
    toast.success("Interview scheduled");
  };

  return (
    <div className="min-h-screen">
      <Navbar showSearch onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <Sidebar type="hr" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className={`pt-24 pb-16 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} md:${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="container mx-auto px-6">
          <div className="mb-6">
            <h1 className="text-3xl font-heading font-bold">Interview Scheduling</h1>
            <p className="text-muted-foreground">Schedule and manage interviews</p>
          </div>

          <GlassCard className="mb-8">
            <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <div>
                <Label>Candidate Name</Label>
                <Input value={candidate} onChange={(e) => setCandidate(e.target.value)} placeholder="e.g., Neha Sharma" />
              </div>
              <div>
                <Label>Role</Label>
                <Input value={role} onChange={(e) => setRole(e.target.value)} placeholder="Frontend Intern" />
              </div>
              <div>
                <Label>Date</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div>
                <Label>Time</Label>
                <Input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
              <div className="md:col-span-4">
                <Button type="submit" className="bg-gradient-blue glow-hover">Add Interview</Button>
              </div>
            </form>
          </GlassCard>

          <GlassCard>
            <h2 className="text-2xl font-heading font-semibold mb-4">All Scheduled Interviews</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">Candidate</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-left py-3 px-4">Date</th>
                    <th className="text-left py-3 px-4">Time</th>
                    <th className="text-left py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {interviews.map((i) => (
                    <tr key={i.id} className="border-b border-border/50 hover:bg-accent/30">
                      <td className="py-3 px-4 font-semibold">{i.candidate}</td>
                      <td className="py-3 px-4 text-muted-foreground">{i.role}</td>
                      <td className="py-3 px-4 text-muted-foreground">{i.date}</td>
                      <td className="py-3 px-4 text-muted-foreground">{i.time || "-"}</td>
                      <td className="py-3 px-4 text-muted-foreground">{i.status}</td>
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

export default InterviewScheduling;