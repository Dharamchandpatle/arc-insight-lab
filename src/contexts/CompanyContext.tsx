import React, { createContext, useContext, useState } from 'react';
import { companyData, CompanyData } from '../data/companyMockData';

interface CompanyContextType {
  data: CompanyData;
  setData: (updater: CompanyData | ((prev: CompanyData) => CompanyData)) => void;
  toggleHRActive: (id: number) => void;
  addHR: (hr: { name: string; role: string; active?: boolean }) => void;
  updateHR: (id: number, updates: Partial<{ name: string; role: string; active: boolean }>) => void;
  deleteHR: (id: number) => void;
  addJob: (job: { title: string; applicants?: number; status?: string }) => void;
  updateJob: (id: number, updates: Partial<{ title: string; applicants: number; status: string }>) => void;
  deleteJob: (id: number) => void;
  regenerateAI: () => void;
  markAllNotificationsRead: () => void;
  addDepartment: (d: { name: string; totalPositions: number }) => void;
  updateDepartment: (id: number, updates: Partial<{ name: string; totalPositions: number; filled: number }>) => void;
  deleteDepartment: (id: number) => void;
}

const CompanyContext = createContext<CompanyContextType | undefined>(undefined);

export const CompanyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setDataState] = useState<CompanyData>(() => {
    try {
      const raw = localStorage.getItem('company_data');
      const loaded = raw ? JSON.parse(raw) : companyData;
      // normalize departments to include an id for easier updates
      if (Array.isArray(loaded.departments)) {
        loaded.departments = loaded.departments.map((d: any, i: number) => ({ id: d.id ?? Date.now() + i, ...d }));
      }
      // ensure aiInsights have ids
      if (Array.isArray(loaded.aiInsights)) {
        loaded.aiInsights = loaded.aiInsights.map((a: any, i: number) => ({ id: a.id ?? Date.now() + i, ...a }));
      }
      return loaded;
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

  const addHR = (hr: { name: string; role: string; active?: boolean }) => {
    setData(prev => ({
      ...prev,
      hrList: [
        ...prev.hrList,
        { id: Date.now(), name: hr.name, role: hr.role, active: hr.active ?? true, interviewsToday: 0 },
      ],
    }));
  };

  const updateHR = (id: number, updates: Partial<{ name: string; role: string; active: boolean }>) => {
    setData(prev => ({
      ...prev,
      hrList: prev.hrList.map(h => (h.id === id ? { ...h, ...updates } : h)),
    }));
  };

  const deleteHR = (id: number) => {
    setData(prev => ({ ...prev, hrList: prev.hrList.filter(h => h.id !== id) }));
  };

  const addDepartment = (d: { name: string; totalPositions: number }) => {
    setData(prev => ({
      ...prev,
      departments: [
        ...prev.departments,
        { id: Date.now(), name: d.name, totalPositions: d.totalPositions, filled: 0 },
      ],
    }));
  };

  const updateDepartment = (id: number, updates: Partial<{ name: string; totalPositions: number; filled: number }>) => {
    setData(prev => ({
      ...prev,
      departments: prev.departments.map(dep => ((dep as any).id === id ? { ...(dep as any), ...updates } : dep)),
    }));
  };

  const deleteDepartment = (id: number) => {
    setData(prev => ({ ...prev, departments: prev.departments.filter(dep => (dep as any).id !== id) }));
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
    setData(prev => {
      const nextAI = prev.aiInsights.map(i => ({ ...i, value: `${Math.floor(70 + Math.random() * 30)}%`, note: i.note }));
      // update some aggregate analytics from generated values
      const numeric = nextAI.map((x: any) => Number(String(x.value).replace('%', '')) || 0);
      const avgAIScore = Math.round(numeric.reduce((s: number, v: number) => s + v, 0) / Math.max(1, numeric.length));
      const avgJDMatch = Math.max(60, Math.min(95, avgAIScore - 5 + Math.floor(Math.random() * 10)));
      return { ...prev, aiInsights: nextAI, analytics: { ...prev.analytics, avgAIScore, avgJDMatch } };
    });
  };

  const markAllNotificationsRead = () => {
    setData(prev => ({ ...prev, notifications: prev.notifications.map(n => ({ ...n, read: true })) }));
  };

  return (
    <CompanyContext.Provider value={{
      data,
      setData,
      toggleHRActive,
      addJob,
      updateJob,
      deleteJob,
      regenerateAI,
      markAllNotificationsRead,
      addHR,
      updateHR,
      deleteHR,
      addDepartment,
      updateDepartment,
      deleteDepartment,
    }}>
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
