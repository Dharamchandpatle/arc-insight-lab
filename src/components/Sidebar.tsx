import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  MessageSquare,
  Settings,
  User,
} from "lucide-react";

interface SidebarProps {
  type: "hr" | "candidate";
  collapsed?: boolean;
  onToggle?: () => void;
}

export const Sidebar = ({ type, collapsed = false, onToggle }: SidebarProps) => {
  const hrLinks = [
    { to: "/candidate-dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/jd-upload", icon: FileText, label: "Upload JD" },
    { to: "/interview-scheduling", icon: Calendar, label: "Interview Scheduling" },
    { to: "/analytics", icon: BarChart3, label: "Analytics" },
    { to: "/settings", icon: Settings, label: "Settings" },
  ];

  const candidateLinks = [
    { to: "/candidate-dashboard", icon: LayoutDashboard, label: "Home" },
    { to: "/candidate-dashboard", icon: Calendar, label: "My Interviews" },
    { to: "/candidate-dashboard", icon: MessageSquare, label: "Feedback" },
    { to: "/candidate-dashboard", icon: User, label: "Profile" },
  ];

  const links = type === "hr" ? hrLinks : candidateLinks;

  return (
    <aside className={`fixed left-0 top-16 bottom-0 glass border-r border-border overflow-y-auto transition-all duration-300 ${
      collapsed ? 'w-16' : 'w-64'
    } hidden md:block`}>
      <div className="p-4 space-y-2">
        {onToggle && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="w-full mb-4"
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
        {links.map((link) => (
          <NavLink
            key={link.to + link.label}
            to={link.to}
            className={`flex items-center gap-3  px-4 py-3 rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-accent/50 ${
              collapsed ? 'justify-center' : ''
            }`}
            activeClassName="bg-accent text-black  font-semibold glow-hover"
          >
            <link.icon className="h-5 w-5" />
            {!collapsed && <span>{link.label}</span>}
          </NavLink>
        ))}
      </div>
    </aside>
  );
};
