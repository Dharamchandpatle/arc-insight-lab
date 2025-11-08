import React from "react";
import { useCandidate } from "@/context/CandidateContext";

export const UpcomingInterviews: React.FC = () => {
  const data = useCandidate();

  return (
    <div className="glass p-4 rounded-xl">
      <h3 className="text-lg font-heading font-semibold mb-3">Upcoming Interviews</h3>
      <div className="space-y-3">
        {data.upcomingInterviews.map((it) => (
          <div key={it.id} className="flex items-center justify-between">
            <div>
              <div className="font-semibold">{it.company} — {it.role}</div>
              <div className="text-xs text-muted-foreground">{it.date} • {it.time}</div>
            </div>
            <div>
              <button className="px-3 py-1 rounded bg-gradient-blue text-black">Details</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingInterviews;
