import React from "react";
import { useCandidate } from "@/context/CandidateContext";

export const FeedbackPanel: React.FC = () => {
  const data = useCandidate();

  return (
    <div className="glass p-4 rounded-xl">
      <h3 className="text-lg font-heading font-semibold mb-3">AI Feedback</h3>
      <div className="space-y-3">
        {data.aiFeedback.map((f, i) => (
          <div key={i} className="p-3 bg-[#021025]/10 rounded">
            <div className="font-semibold">{f.question}</div>
            <div className="text-sm text-muted-foreground mt-1">{f.feedback}</div>
            <div className="text-xs text-sky-200 mt-1">Score: {f.score}/10</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedbackPanel;
