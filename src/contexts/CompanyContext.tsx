import React, { createContext, useContext, useState } from 'react';
import { companyData, CompanyData } from '../data/companyMockData';

interface CompanyContextType {
  data: CompanyData;
  setData: (updater: CompanyData | ((prev: CompanyData) => CompanyData)) => void;
  toggleHRActive: (id: number) => void;
  addJob: (job: { title: string; applicants?: number; status?: string }) => void;
  updateJob: (id: number, updates: Partial<{ title: string; applicants: number; status: string }>) => void;
  deleteJob: (id: number) => void;
  regenerateAI: () => void;
  markAllNotificationsRead: () => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setDataState] = useState<CompanyData>(() => {
    try {
      const raw = localStorage.getItem('company_data');
      return raw ? JSON.parse(raw) : companyData;
    } catch (e) {
      return companyData;
    }
  });

  const setData = (updater: CompanyData | ((prev: CompanyData) => CompanyData)) => {
    setDataState(prev => {
      const next = typeof updater === 'function' ? (updater as any)(prev) : updater;
      try { localStorage.setItem('company_data', JSON.stringify(next)); } catch (e) {}
      return next;
    });
  };

  const toggleHRActive = (id: number) => {
    setData(prev => ({
      ...prev,
      hrList: prev.hrList.map(h => (h.id === id ? { ...h, active: !h.active } : h)),
    }));
  };

  const addJob = (job: { title: string; applicants?: number; status?: string }) => {
    setData(prev => ({
      ...prev,
      jobPostings: [
        ...prev.jobPostings,
        { id: Date.now(), title: job.title, applicants: job.applicants ?? 0, status: job.status ?? 'Open' },
      ],
    }));
  };

  const updateJob = (id: number, updates: Partial<{ title: string; applicants: number; status: string }>) => {
    setData(prev => ({
      ...prev,
      jobPostings: prev.jobPostings.map(j => (j.id === id ? { ...j, ...updates } : j)),
    }));
  };

  const deleteJob = (id: number) => {
    setData(prev => ({ ...prev, jobPostings: prev.jobPostings.filter(j => j.id !== id) }));
  };

  const regenerateAI = () => {
    // quick randomized mock values
    setData(prev => ({
      ...prev,
      aiInsights: prev.aiInsights.map(i => ({
        ...i,
        value: `${Math.floor(70 + Math.random() * 30)}%`,
      })),
    }));
  };

  const markAllNotificationsRead = () => {
    setData(prev => ({ ...prev, notifications: prev.notifications.map(n => ({ ...n, read: true })) }));
  };

  return (
    <CompanyContext.Provider value={{ data, setData, toggleHRActive, addJob, updateJob, deleteJob, regenerateAI, markAllNotificationsRead }}>
      {children}
    </CompanyContext.Provider>
  );
};

export const useCompany = () => {
  const ctx = useContext(CompanyContext);
  if (!ctx) throw new Error('useCompany must be used within CompanyProvider');
  return ctx;
};

export default CompanyContext;
