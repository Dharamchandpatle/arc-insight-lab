import { GlassCard } from "@/components/GlassCard";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getJDs, JDItem, saveJDs } from "@/data/hrData";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const JDUpload = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [skills, setSkills] = useState("");
  const [text, setText] = useState("");
  const [jds, setJds] = useState<JDItem[]>(() => getJDs());

  useEffect(() => {
    setJds(getJDs());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return toast.error("Please provide a job title");
    const newJD: JDItem = {
      id: Date.now(),
      title,
      department,
      skills: skills.split(",").map((s) => s.trim()).filter(Boolean),
      text,
      createdAt: new Date().toISOString(),
    };
    const updated = [newJD, ...jds];
    saveJDs(updated);
    setJds(updated);
    setTitle("");
    setDepartment("");
    setSkills("");
    setText("");
    toast.success("JD uploaded successfully");
  };

  return (
    <div className="min-h-screen">
      <Navbar showSearch onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <Sidebar type="hr" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className={`pt-24 pb-16 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} md:${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="container mx-auto px-6">
          <div className="mb-6">
            <h1 className="text-3xl font-heading font-bold">Upload Job Description</h1>
            <p className="text-muted-foreground">Add and manage job descriptions for matching with candidates</p>
          </div>

          <GlassCard className="mb-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Senior Frontend Developer" />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Engineering" />
              </div>
              <div>
                <Label htmlFor="skills">Required Skills (comma-separated)</Label>
                <Input id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="React, TypeScript, Tailwind" />
              </div>
              <div>
                <Label htmlFor="text">Job Description</Label>
                <textarea id="text" rows={6} value={text} onChange={(e) => setText(e.target.value)} className="w-full px-3 py-2 glass rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              <Button type="submit" className="bg-gradient-blue glow-hover">Upload JD</Button>
            </form>
          </GlassCard>

          <GlassCard>
            <h2 className="text-2xl font-heading font-semibold mb-4">Recently Added JDs</h2>
            {jds.length === 0 ? (
              <div className="text-muted-foreground">No JDs added yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4">Title</th>
                      <th className="text-left py-3 px-4">Department</th>
                      <th className="text-left py-3 px-4">Skills</th>
                      <th className="text-left py-3 px-4">Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jds.map((jd) => (
                      <tr key={jd.id} className="border-b border-border/50 hover:bg-accent/30">
                        <td className="py-3 px-4 font-semibold">{jd.title}</td>
                        <td className="py-3 px-4 text-muted-foreground">{jd.department}</td>
                        <td className="py-3 px-4 text-muted-foreground">{(jd.skills || []).join(", ")}</td>
                        <td className="py-3 px-4 text-muted-foreground">{new Date(jd.createdAt).toISOString().split('T')[0]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </GlassCard>
        </div>
      </main>
    </div>
  );
};

export default JDUpload;