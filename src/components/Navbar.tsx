import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface NavbarProps {
  showSearch?: boolean;
}

export const Navbar = ({ showSearch = false }: NavbarProps) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-blue glow-blue flex items-center justify-center">
              <span className="text-white font-heading font-bold text-lg">AI</span>
            </div>
            <span className="text-2xl font-heading font-bold glow-blue-text">
              AI-NEXUS
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {showSearch && (
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 w-64 glass border-border/50"
                />
              </div>
            )}
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
};
