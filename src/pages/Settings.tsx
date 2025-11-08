import { GlassCard } from "@/components/GlassCard";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [org, setOrg] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("hr-profile");
    if (saved) {
      try {
        const p = JSON.parse(saved);
        setName(p.name || "");
        setEmail(p.email || "");
        setOrg(p.org || "");
      } catch {}
    }
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("hr-profile", JSON.stringify({ name, email, org }));
    alert("Profile saved (mock)");
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen">
      <Navbar showSearch onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <Sidebar type="hr" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className={`pt-24 pb-16 transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'} md:${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        <div className="container mx-auto px-6">
          <div className="mb-6">
            <h1 className="text-3xl font-heading font-bold">Settings</h1>
            <p className="text-muted-foreground">Profile and preferences</p>
          </div>

          <GlassCard className="mb-8">
            <form onSubmit={handleSave} className="space-y-4 max-w-xl">
              <div>
                <Label>HR Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" />
              </div>
              <div>
                <Label>Organization</Label>
                <Input value={org} onChange={(e) => setOrg(e.target.value)} placeholder="Organization" />
              </div>
              <div className="flex items-center gap-4">
                <Label>Theme</Label>
                <Button variant="ghost" onClick={toggleTheme}>{theme === "dark" ? "Dark" : "Light"}</Button>
              </div>
              <div className="flex gap-4">
                <Button type="submit" className="bg-gradient-blue glow-hover">Save</Button>
                <Button variant="outline" onClick={handleLogout}>Logout</Button>
              </div>
            </form>
          </GlassCard>
        </div>
      </main>
    </div>
  );
};

export default Settings;
