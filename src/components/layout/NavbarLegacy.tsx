import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Menu, Mic, Search, Video } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface NavbarProps {
  showSearch?: boolean;
  onToggleSidebar?: () => void;
}

export const NavbarLegacy = ({ showSearch = false, onToggleSidebar }: NavbarProps) => {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();

  async function handleLogin(e?: React.FormEvent) {
    e?.preventDefault();
    const u = await auth.login(username.trim(), password.trim());
    if (u) {
      setShowLogin(false);
      setUsername("");
      setPassword("");
      // navigate according to role
      if (u.role === "HR") navigate("/candidate-dashboard");
      else navigate("/candidate-dashboard");
    } else {
      alert("Invalid credentials (use candidate/1234 or hr/1234)");
    }
  }

  function handleLogout() {
    auth.logout();
    navigate("/");
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onToggleSidebar && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleSidebar}
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
            )}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-blue glow-blue flex items-center justify-center">
                <span className="text-white font-heading font-bold text-lg">AI</span>
              </div>
              <span className="text-2xl font-heading font-bold glow-blue-text">AI-NEXUS</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {showSearch && (
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search..." className="pl-10 w-64 glass border-border/50" />
              </div>
            )}

            {/* If logged in show audio/video/logout */}
            {auth.user ? (
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setAudioEnabled((s) => !s)}
                  title={audioEnabled ? "Mute audio" : "Enable audio"}
                >
                  <Mic className={`h-5 w-5 ${audioEnabled ? "text-green-400" : "text-muted-foreground"}`} />
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setVideoEnabled((s) => !s)}
                  title={videoEnabled ? "Disable video" : "Enable video"}
                >
                  <Video className={`h-5 w-5 ${videoEnabled ? "text-green-400" : "text-muted-foreground"}`} />
                </Button>

                <Button variant="ghost" size="icon" onClick={handleLogout} title="Logout">
                  <LogOut className="h-5 w-5 text-rose-400" />
                </Button>
              </div>
            ) : (
              <>
                <ThemeToggle />
                <Button variant="ghost" onClick={() => setShowLogin((s) => !s)}>
                  Login
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Login panel */}
        {showLogin && !auth.user && (
          <div className="mt-3 container mx-auto px-6">
            <form onSubmit={handleLogin} className="flex items-center gap-2">
              <input
                className="input glass px-3 py-2 rounded w-40"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                className="input glass px-3 py-2 rounded w-40"
                placeholder="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button type="submit">Sign In</Button>
            </form>
            <div className="text-xs text-muted-foreground mt-2">Try: candidate/1234 or hr/1234</div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavbarLegacy;
