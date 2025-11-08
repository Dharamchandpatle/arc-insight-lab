import { Link } from "react-router-dom";

export const FooterLegacy = () => {
  return (
    <footer className="w-full glass border-t border-border/50 py-4">
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-blue flex items-center justify-center">
            <span className="text-white font-bold">AI</span>
          </div>
          <div>
            <div className="text-sm font-semibold">AI-NEXUS</div>
            <div className="text-xs text-muted-foreground">Neon glass HR tools</div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <Link to="/" className="text-muted-foreground hover:underline">Home</Link>
          <Link to="/hr-dashboard" className="text-muted-foreground hover:underline">HR</Link>
          <Link to="/analytics" className="text-muted-foreground hover:underline">Analytics</Link>
        </div>
      </div>
    </footer>
  );
};

export default FooterLegacy;
