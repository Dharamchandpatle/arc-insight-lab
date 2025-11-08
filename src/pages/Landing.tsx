import { AIBot3D } from "@/components/AIBot3D";
import AIInteractiveBackground from "@/components/AIInteractiveBackground";
import { Button } from "@/components/ui/button";
import gsap from "gsap";
import { ArrowRight, Sparkles, Target, TrendingUp } from "lucide-react";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Hero animation
    if (heroRef.current) {
      gsap.from(heroRef.current.children, {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      });
    }

    // Features animation
    if (featuresRef.current) {
      gsap.from(featuresRef.current.children, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        delay: 0.5,
        ease: "power2.out",
      });
    }
  }, []);

  return (
    <div className="min-h-screen">
      
      <main className="relative pt-6 pb-16">
  <AIInteractiveBackground />
        {/* Hero Section */}
        <section className="container mx-auto px-6 py-20">
          <div ref={heroRef} className="text-center max-w-4xl mx-auto space-y-8">
            <div className="inline-block">
              <span className="text-sm font-semibold text-primary uppercase tracking-wider px-4 py-2 rounded-full border border-primary/30 glass">
                AI-Powered Analytics
              </span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-heading font-bold leading-tight">
              From{" "}
              <span className="glow-blue-text">Subjective</span>
              <br />
              to{" "}
              <span className="glow-blue-text">Objective</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Transform your interview process with AI-driven insights, real-time transcription, 
              and objective candidate evaluation.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  size="lg"
                  onClick={() => navigate("/hr/dashboard")}
                  className="group bg-gradient-blue glow-hover text-white font-semibold px-8 py-6 text-lg"
                >
                  Login as HR
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/candidate-dashboard")}
                className="font-semibold px-8 py-6 text-lg border-primary hover:bg-primary/10"
              >
                Login as Candidate
              </Button>
            </div>
          </div>

          {/* 3D Bot */}
          <div className="mt-20">
            <AIBot3D />
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-6 py-20">
          <div ref={featuresRef} className="grid md:grid-cols-3 gap-8">
            <div className="glass rounded-xl p-8 glow-hover text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">
                Real-Time Transcription
              </h3>
              <p className="text-muted-foreground">
                Accurate speech-to-text conversion capturing every detail of the interview.
              </p>
            </div>

            <div className="glass rounded-xl p-8 glow-hover text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">
                AI-Driven Feedback
              </h3>
              <p className="text-muted-foreground">
                Intelligent analysis providing actionable insights on candidate performance.
              </p>
            </div>

            <div className="glass rounded-xl p-8 glow-hover text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-heading font-semibold mb-3">
                Objective Ranking
              </h3>
              <p className="text-muted-foreground">
                Data-driven candidate scoring eliminating bias from hiring decisions.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Landing;
