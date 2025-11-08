import React from "react";
import { useCandidate } from "@/context/CandidateContext";

export const InterviewHistory: React.FC = () => {
  const data = useCandidate();

  return (
    <div className="glass p-4 rounded-xl">
      <h3 className="text-lg font-heading font-semibold mb-4">Interview History</h3>
      <div className="space-y-3">
        {data.history.map((h) => (
          <div key={h.id} className="p-3 bg-[#021025]/20 rounded">
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="font-semibold">{h.company} — {h.role}</div>
                <div className="text-xs text-muted-foreground">{h.date}</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-primary font-bold">{h.feedbackScore}</div>
                <div className="text-xs text-muted-foreground">{h.result}</div>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">JD Match: {h.jdMatch}% • Communication: {h.communication}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterviewHistory;
