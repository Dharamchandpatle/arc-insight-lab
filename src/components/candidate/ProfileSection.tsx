import React from "react";
import { Button } from "@/components/ui/button";
import { useCandidate } from "@/context/CandidateContext";

export const ProfileSection: React.FC<{ onJoin?: () => void }> = ({ onJoin }) => {
  const data = useCandidate();
  const p = data.profile;

  return (
    <div className="glass p-4 rounded-xl flex items-center gap-4">
      <img src={p.avatar} alt={p.name} className="w-20 h-20 rounded-full object-cover border-2 border-sky-400" />
      <div className="flex-1">
        <div className="text-lg font-heading font-bold">{p.name}</div>
        <div className="text-sm text-muted-foreground">{p.role} • {p.level}</div>
        <div className="mt-3 flex gap-3">
          <Button onClick={onJoin} className="bg-gradient-blue">Join Next Interview</Button>
        </div>
      </div>
      <div className="w-40 grid grid-cols-1 gap-2">
        <div className="text-xs text-muted-foreground">JD Match</div>
        <div className="text-2xl font-bold text-sky-200">{p.jdMatch}%</div>
        <div className="text-xs text-muted-foreground">Overall</div>
        <div className="text-2xl font-bold text-sky-200">{p.overallScore}%</div>
      </div>
    </div>
  );
};

export default ProfileSection;
