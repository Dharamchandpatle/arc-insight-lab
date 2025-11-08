import { candidateData as initialCandidateData } from "@/data/candidateMockData";
import React, { createContext, useCallback, useContext, useState } from "react";

// Use a flexible shape here because mock data is in JS and may evolve.
type CandidateShape = any;

type CandidateContextType = {
  data: CandidateShape;
  loading: boolean;
  setData: React.Dispatch<React.SetStateAction<CandidateShape>>;
  refresh: () => Promise<void>;
};

const CandidateContext = createContext<CandidateContextType | null>(null);

export const CandidateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize from mock data, but merge persisted practiceScores from localStorage if available
  const persisted = typeof window !== 'undefined' ? localStorage.getItem('ai_nexus_practice') : null;
  const persistedObj = persisted ? JSON.parse(persisted) : null;

  const [data, setData] = useState<CandidateShape>(
    persistedObj ? { ...initialCandidateData, practiceScores: persistedObj.practiceScores || [] } : (initialCandidateData as CandidateShape)
  );
  const [loading, setLoading] = useState<boolean>(false);

  // Persist practiceScores whenever they change
  React.useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const toPersist = { practiceScores: data?.practiceScores || [] };
      localStorage.setItem('ai_nexus_practice', JSON.stringify(toPersist));
    } catch (e) {
      // ignore
    }
  }, [data?.practiceScores]);

  // Placeholder refresh - in future can fetch from API
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      // Simulate refresh delay; replace with fetch call if needed
      await new Promise((res) => setTimeout(res, 300));
      setData((d) => ({ ...d }));
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <CandidateContext.Provider value={{ data, loading, setData, refresh }}>
      {children}
    </CandidateContext.Provider>
  );
};

export function useCandidate() {
  const ctx = useContext(CandidateContext);
  if (!ctx) throw new Error("useCandidate must be used within CandidateProvider");
  return ctx;
}

export default CandidateContext;
