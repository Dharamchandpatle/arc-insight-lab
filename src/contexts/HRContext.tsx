import React, { createContext, useCallback, useContext, useState } from 'react';
import { addInterview, Analytics, deleteInterview, hrData, HRData, Interview, updateAnalytics, updateInterview } from '../mockData/hrMockData';

interface JobDescription {
  id: number;
  title: string;
  department?: string;
  experience?: string;
  location?: string;
  description?: string;
  skills: string;
  postedOn: string;
}

interface CandidateStat {
  name: string;
  jdMatch: number;
  communication: number;
  aiScore: number;
}

interface AIFeedback {
  candidate: string;
  feedback: string;
  improvement: string;
}

interface HRContextType {
  // New consolidated API used by components
  data: HRData;
  jobDescriptions: JobDescription[];
  scheduledInterviews: Interview[];
  candidateStats: CandidateStat[];
  aiFeedbacks: AIFeedback[];
  analytics: Analytics;

  // Helpers
  addNewInterview: (interview: Omit<Interview, "id">) => Interview;
  updateExistingInterview: (id: number, updates: Partial<Interview>) => Interview | null;
  removeInterview: (id: number) => boolean;
  updateAnalyticsData: (updates: Partial<Analytics>) => Analytics;
  addAIFeedback: (fb: Omit<AIFeedback, 'candidate'> & { candidate: string }) => void;
  updateAIFeedback: (index: number, updates: Partial<AIFeedback>) => AIFeedback | null;
  deleteAIFeedback: (index: number) => boolean;

  // Legacy-friendly helpers used by older components
  addJobDescription: (jd: Omit<JobDescription, 'id'>) => void;
  updateJobDescription: (id: number, updates: Partial<JobDescription>) => JobDescription | null;
  deleteJobDescription: (id: number) => boolean;
  updateInterviewStatus: (id: number, status: string) => void;
  addInterview: (interview: Omit<Interview, 'id'>) => void;
}

const HRContext = createContext<HRContextType | undefined>(undefined);

export const HRProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<HRData>(() => {
    // Seed upcoming interviews from localStorage if present, otherwise use hrData
    try {
      const raw = localStorage.getItem('hr_upcomingInterviews');
      if (raw) {
        const parsed: Interview[] = JSON.parse(raw);
        return { ...hrData, upcomingInterviews: parsed } as HRData;
      }
    } catch (e) {
      // ignore and fallback to hrData
    }
    return hrData;
  });
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>(() => {
    const raw = localStorage.getItem('hr_jobDescriptions');
    return raw ? JSON.parse(raw) as JobDescription[] : [];
  });
  const [candidateStats, setCandidateStats] = useState<CandidateStat[]>(() => {
    const raw = localStorage.getItem('hr_candidateStats');
    return raw ? JSON.parse(raw) as CandidateStat[] : [];
  });
  const [aiFeedbacks, setAIFeedbacks] = useState<AIFeedback[]>(() => {
    const raw = localStorage.getItem('hr_aiFeedbacks');
    return raw ? JSON.parse(raw) as AIFeedback[] : [];
  });

  const addNewInterview = useCallback((interview: Omit<Interview, "id">) => {
    const newInterview = addInterview(interview);
    setData(prevData => ({
      ...prevData,
      upcomingInterviews: [...prevData.upcomingInterviews, newInterview]
    }));
    return newInterview;
  }, []);

  // Legacy wrapper used by older components
  const addInterviewLegacy = useCallback((interview: Omit<Interview, 'id'>) => {
    addNewInterview(interview);
  }, [addNewInterview]);

  const updateExistingInterview = useCallback((id: number, updates: Partial<Interview>) => {
    const updatedInterview = updateInterview(id, updates);
    if (updatedInterview) {
      setData(prevData => ({
        ...prevData,
        upcomingInterviews: prevData.upcomingInterviews.map(interview =>
          interview.id === id ? updatedInterview : interview
        )
      }));
    }
    return updatedInterview;
  }, []);

  const updateInterviewStatus = useCallback((id: number, status: string) => {
    const updated = updateExistingInterview(id, { status });
    if (updated) {
      // already updated data in updateExistingInterview
    }
  }, [updateExistingInterview]);

  const removeInterview = useCallback((id: number) => {
    const success = deleteInterview(id);
    if (success) {
      setData(prevData => ({
        ...prevData,
        upcomingInterviews: prevData.upcomingInterviews.filter(interview => interview.id !== id)
      }));
    }
    return success;
  }, []);

  // persist upcoming interviews to localStorage whenever they change
  React.useEffect(() => {
    try {
      localStorage.setItem('hr_upcomingInterviews', JSON.stringify(data.upcomingInterviews));
    } catch (e) {
      // ignore storage errors
    }
  }, [data.upcomingInterviews]);

  const updateAnalyticsData = useCallback((updates: Partial<Analytics>) => {
    const updatedAnalytics = updateAnalytics(updates);
    setData(prevData => ({
      ...prevData,
      analytics: updatedAnalytics
    }));
    return updatedAnalytics;
  }, []);

  const addAIFeedback = useCallback((fb: Omit<AIFeedback, 'candidate'> & { candidate: string }) => {
    const newFb: AIFeedback = { candidate: fb.candidate, feedback: fb.feedback, improvement: fb.improvement };
    setAIFeedbacks(prev => {
      const next = [...prev, newFb];
      try { localStorage.setItem('hr_aiFeedbacks', JSON.stringify(next)); } catch (e) {}
      return next;
    });
  }, []);

  const updateAIFeedback = useCallback((index: number, updates: Partial<AIFeedback>) => {
    let updated: AIFeedback | null = null;
    setAIFeedbacks(prev => {
      if (index < 0 || index >= prev.length) return prev;
      const next = prev.map((fb, i) => {
        if (i === index) {
          updated = { ...fb, ...updates };
          return updated;
        }
        return fb;
      });
      try { localStorage.setItem('hr_aiFeedbacks', JSON.stringify(next)); } catch (e) {}
      return next;
    });
    return updated;
  }, []);

  const deleteAIFeedback = useCallback((index: number) => {
    let existed = false;
    setAIFeedbacks(prev => {
      if (index < 0 || index >= prev.length) return prev;
      existed = true;
      const next = prev.filter((_, i) => i !== index);
      try { localStorage.setItem('hr_aiFeedbacks', JSON.stringify(next)); } catch (e) {}
      return next;
    });
    return existed;
  }, []);

  const addJobDescription = useCallback((jd: Omit<JobDescription, 'id'>) => {
    const newJd: JobDescription = { ...jd, id: Date.now() };
    setJobDescriptions(prev => {
      const next = [...prev, newJd];
      localStorage.setItem('hr_jobDescriptions', JSON.stringify(next));
      return next;
    });
  }, []);

  const updateJobDescription = useCallback((id: number, updates: Partial<JobDescription>) => {
    let updated: JobDescription | null = null;
    setJobDescriptions(prev => {
      const next = prev.map(jd => {
        if (jd.id === id) {
          updated = { ...jd, ...updates };
          return updated;
        }
        return jd;
      });
      localStorage.setItem('hr_jobDescriptions', JSON.stringify(next));
      return next;
    });
    return updated;
  }, []);

  const deleteJobDescription = useCallback((id: number) => {
    let existed = false;
    setJobDescriptions(prev => {
      const next = prev.filter(jd => {
        if (jd.id === id) existed = true;
        return jd.id !== id;
      });
      localStorage.setItem('hr_jobDescriptions', JSON.stringify(next));
      return next;
    });
    return existed;
  }, []);

  return (
    <HRContext.Provider
      value={{
        data,
        jobDescriptions,
        scheduledInterviews: data.upcomingInterviews,
        candidateStats,
        aiFeedbacks,
        analytics: data.analytics,

        addNewInterview,
        updateExistingInterview,
        removeInterview,
        updateAnalyticsData,

  // legacy helpers
  addJobDescription,
  updateJobDescription,
  deleteJobDescription,
  updateInterviewStatus,
  addInterview: addInterviewLegacy,
        addAIFeedback,
        updateAIFeedback,
        deleteAIFeedback,
      }}
    >
      {children}
    </HRContext.Provider>
  );
};

export const useHR = () => {
  const context = useContext(HRContext);
  if (context === undefined) {
    throw new Error('useHR must be used within an HRProvider');
  }
  return context;
};

export default HRContext;