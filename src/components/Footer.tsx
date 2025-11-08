import gsap from "gsap";
import { Github, Linkedin, Twitter } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const tl = gsap.fromTo(
      ref.current,
      { autoAlpha: 0, y: 24 },
      { autoAlpha: 1, y: 0, duration: 0.8, ease: "power2.out" }
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <footer
      ref={ref}
      className="mt-12 glass border-t border-border/40 bg-gradient-to-t from-[#021826]/60 via-[#031e2b]/40 to-transparent backdrop-blur-lg"
    >
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-indigo-600 shadow-lg flex items-center justify-center">
              <span className="text-white font-bold">AI</span>
            </div>
            <div>
              <div className="text-white font-semibold">AI-NEXUS</div>
              <div className="text-xs text-sky-200/60">Neon glass HR & analytics studio</div>
            </div>
          </div>

          <nav className="flex items-center gap-4">
            <Link to="/" className="text-sm text-sky-100/80 hover:underline">
              Home
            </Link>
            <Link to="/hr-dashboard" className="text-sm text-sky-100/80 hover:underline">
              HR
            </Link>
            <Link to="/analytics" className="text-sm text-sky-100/80 hover:underline">
              Analytics
            </Link>
            <Link to="/settings" className="text-sm text-sky-100/80 hover:underline">
              Settings
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <a href="#" aria-label="Twitter" className="text-sky-200/90 hover:text-sky-400">
              <Twitter />
            </a>
            <a href="#" aria-label="LinkedIn" className="text-sky-200/90 hover:text-sky-400">
              <Linkedin />
            </a>
            <a href="#" aria-label="GitHub" className="text-sky-200/90 hover:text-sky-400">
              <Github />
            </a>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-sky-200/40">
          © {new Date().getFullYear()} AI-NEXUS — Built with care. All rights reserved.
        </div>
      </div>
    </footer>
  );
};
