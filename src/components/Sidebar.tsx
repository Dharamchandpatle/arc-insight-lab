import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  FileText,
  BarChart3,
  Settings,
  User,
  Calendar,
  MessageSquare,
} from "lucide-react";

interface SidebarProps {
  type: "hr" | "candidate";
}

export const Sidebar = ({ type }: SidebarProps) => {
  const hrLinks = [
    { to: "/hr-dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/hr-dashboard", icon: FileText, label: "Upload JD" },
    { to: "/analytics", icon: BarChart3, label: "Analytics" },
    { to: "/hr-dashboard", icon: Settings, label: "Settings" },
  ];

  const candidateLinks = [
    { to: "/candidate-dashboard", icon: LayoutDashboard, label: "Home" },
    { to: "/candidate-dashboard", icon: Calendar, label: "My Interviews" },
    { to: "/candidate-dashboard", icon: MessageSquare, label: "Feedback" },
    { to: "/candidate-dashboard", icon: User, label: "Profile" },
  ];

  const links = type === "hr" ? hrLinks : candidateLinks;

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 glass border-r border-border overflow-y-auto">
      <div className="p-6 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to + link.label}
            to={link.to}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-muted-foreground hover:text-foreground hover:bg-accent/50"
            activeClassName="bg-accent text-primary font-semibold glow-hover"
          >
            <link.icon className="h-5 w-5" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </div>
    </aside>
  );
};
