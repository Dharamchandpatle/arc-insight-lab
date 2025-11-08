import React, { createContext, useContext } from "react";
import candidateData from "@/data/candidateMockData";

export type Candidate = typeof candidateData;

const CandidateContext = createContext<Candidate | null>(null);

export const CandidateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // For now provide static mock data; can be extended to fetch or localStorage
  return <CandidateContext.Provider value={candidateData}>{children}</CandidateContext.Provider>;
};

export function useCandidate() {
  const ctx = useContext(CandidateContext);
  if (!ctx) throw new Error("useCandidate must be used within CandidateProvider");
  return ctx;
}

export default CandidateContext;
