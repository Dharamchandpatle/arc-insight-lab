import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Navbar } from "@/components/Navbar";
import { GlassCard } from "@/components/GlassCard";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Mic, MicOff, CheckCircle, AlertCircle } from "lucide-react";
import { AIBot3D } from "@/components/AIBot3D";

const InterviewPage = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcription, setTranscription] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const soundwaveRef = useRef<HTMLDivElement>(null);

  const mockFeedback = {
    technical_score: 88,
    communication_score: 76,
    jd_match: 82,
    strengths: ["Good technical articulation", "Confident tone"],
    weaknesses: ["Slow response", "Needs clarity in examples"],
  };

  useEffect(() => {
    if (contentRef.current) {
      gsap.from(contentRef.current.children, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
      });
    }
  }, []);

  useEffect(() => {
    if (isListening && soundwaveRef.current) {
      // Animate soundwave bars
      const bars = soundwaveRef.current.children;
      Array.from(bars).forEach((bar, i) => {
        gsap.to(bar, {
          scaleY: Math.random() * 1.5 + 0.5,
          duration: 0.3,
          repeat: -1,
          yoyo: true,
          delay: i * 0.1,
        });
      });
    }
  }, [isListening]);

  const handleStartListening = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Mock transcription update
      setTimeout(() => {
        setTranscription(
          "I have three years of experience working with React and TypeScript. I've built several complex applications including e-commerce platforms and dashboards..."
        );
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-6" ref={contentRef}>
          <div className="mb-8">
            <h1 className="text-4xl font-heading font-bold mb-2">Live Interview</h1>
            <p className="text-muted-foreground">Real-time AI-powered interview analytics</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: AI Bot & Soundwave */}
            <GlassCard glow>
              <div className="space-y-8">
                <AIBot3D />
                
                {/* Soundwave Visualization */}
                <div className="flex justify-center items-end gap-2 h-24">
                  <div ref={soundwaveRef} className="flex items-end gap-2 h-full">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 bg-gradient-blue rounded-full transition-all"
                        style={{ height: isListening ? "50%" : "20%" }}
                      />
                    ))}
                  </div>
                </div>

                <Button
                  size="lg"
                  onClick={handleStartListening}
                  className={`w-full font-semibold ${
                    isListening
                      ? "bg-destructive hover:bg-destructive/90"
                      : "bg-gradient-blue glow-hover"
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="mr-2 h-5 w-5" />
                      Stop Listening
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-5 w-5" />
                      Start Listening
                    </>
                  )}
                </Button>
              </div>
            </GlassCard>

            {/* Right: Transcription & Feedback */}
            <div className="space-y-6">
              {/* Transcription */}
              <GlassCard>
                <h2 className="text-xl font-heading font-semibold mb-4">Live Transcription</h2>
                <div className="glass p-4 rounded-lg min-h-[200px] max-h-[300px] overflow-y-auto">
                  {transcription ? (
                    <p className="text-sm leading-relaxed">{transcription}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Click "Start Listening" to begin transcription...
                    </p>
                  )}
                </div>
              </GlassCard>

              {/* AI Feedback */}
              <GlassCard>
                <h2 className="text-xl font-heading font-semibold mb-4">AI Feedback</h2>
                <div className="space-y-4">
                  {/* Scores */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Technical</p>
                      <p className="text-2xl font-bold text-primary">{mockFeedback.technical_score}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Communication</p>
                      <p className="text-2xl font-bold text-primary">{mockFeedback.communication_score}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">JD Match</p>
                      <p className="text-2xl font-bold text-primary">{mockFeedback.jd_match}%</p>
                    </div>
                  </div>

                  {/* Progress bars */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Technical Score</span>
                        <span className="text-primary">{mockFeedback.technical_score}%</span>
                      </div>
                      <Progress value={mockFeedback.technical_score} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Communication</span>
                        <span className="text-primary">{mockFeedback.communication_score}%</span>
                      </div>
                      <Progress value={mockFeedback.communication_score} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>JD Match</span>
                        <span className="text-primary">{mockFeedback.jd_match}%</span>
                      </div>
                      <Progress value={mockFeedback.jd_match} />
                    </div>
                  </div>

                  {/* Strengths & Weaknesses */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary" />
                        Strengths
                      </h3>
                      <ul className="space-y-1">
                        {mockFeedback.strengths.map((strength, i) => (
                          <li key={i} className="text-sm text-muted-foreground pl-6">
                            • {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
                        <AlertCircle className="h-4 w-4 text-destructive" />
                        Areas for Improvement
                      </h3>
                      <ul className="space-y-1">
                        {mockFeedback.weaknesses.map((weakness, i) => (
                          <li key={i} className="text-sm text-muted-foreground pl-6">
                            • {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewPage;
