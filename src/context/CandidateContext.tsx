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

  // Fetch data from backend API
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const { interviewsAPI, reportsAPI } = await import('../lib/api');
      
      // Fetch interviews and reports for candidate
      const [interviews, reports] = await Promise.all([
        interviewsAPI.getAll().catch(() => []),
        reportsAPI.getAll().catch(() => [])
      ]);
      
      // Transform backend data to match frontend format
      const upcomingInterviews = interviews
        .filter((inv: any) => inv.status === 'scheduled' || inv.status === 'in-progress')
        .map((inv: any, index: number) => {
          const date = new Date(inv.scheduledAt);
          return {
            id: index + 1,
            company: inv.hrId?.name || 'Company',
            role: inv.jobDescription?.title || 'Position',
            date: date.toLocaleDateString(),
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            interviewId: inv.interviewId,
          };
        });
      
      const history = reports.map((report: any, index: number) => {
        const date = new Date(report.generatedAt || report.createdAt);
        return {
          id: index + 1,
          company: report.hrId?.name || 'Company',
          role: report.interviewId || 'Position',
          date: date.toLocaleDateString(),
          feedbackScore: report.overallScore || 0,
          result: report.recommendation || 'Pending',
          jdMatch: report.jdMatch || 0,
          communication: report.communicationScore || 0,
        };
      });
      
      setData((prevData) => ({
        ...prevData,
        upcomingInterviews,
        history,
      }));
    } catch (error) {
      console.error('Failed to refresh candidate data:', error);
      // Keep existing data on error
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data from backend on mount
  React.useEffect(() => {
    refresh();
  }, [refresh]);

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
