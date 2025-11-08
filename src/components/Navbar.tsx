import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import gsap from "gsap";
import { Menu, Search } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";

interface NavbarProps {
  showSearch?: boolean;
  onToggleSidebar?: () => void;
}

export const Navbar = ({ showSearch = false, onToggleSidebar }: NavbarProps) => {
  const el = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!el.current) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const tl = gsap.timeline({ repeat: -1, yoyo: true });
    tl.to(el.current, { boxShadow: "0 8px 40px rgba(45, 140, 255, 0.08)", duration: 2 });

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <nav
      ref={el}
      className="fixed top-0 left-0 right-0 z-50 glass bg-gradient-to-r from-[#031224]/60 via-[#04243a]/50 to-[#021826]/60 border-b border-border backdrop-blur-lg">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onToggleSidebar && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggleSidebar}
                className="md:hidden"
                aria-label="Toggle menu"
              >
                <Menu className="h-5 w-5 text-sky-300" />
              </Button>
            )}

            <Link to="/" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 shadow-lg flex items-center justify-center glow-blue">
                <span className="text-white font-heading font-bold text-lg">AI</span>
              </div>
              <span className="text-2xl font-heading font-bold text-sky-200 tracking-wide">
                AI-NEXUS
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <Link to="/candidate-dashboard" className="text-sm text-sky-100/80 hover:underline">
                HR
              </Link>
              <Link to="/analytics" className="text-sm text-sky-100/80 hover:underline">
                Analytics
              </Link>
              <Link to="/candidate-dashboard" className="text-sm text-sky-100/80 hover:underline">
                Candidates
              </Link>
              <Link to="/jd-upload" className="text-sm text-sky-100/80 hover:underline">
                Post JD
              </Link>
            </div>

            {showSearch && (
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-sky-200/70" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 w-64 glass border-border/40 bg-transparent text-sky-100"
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
