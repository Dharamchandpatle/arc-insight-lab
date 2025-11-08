import React, { createContext, useContext, useState, useEffect } from 'react';
import { candidateData } from '../data/candidateMockData';

const CandidateContext = createContext();

export const useCandidate = () => {
  const context = useContext(CandidateContext);
  if (!context) {
    throw new Error('useCandidate must be used within a CandidateProvider');
  }
  return context;
};

export const CandidateProvider = ({ children }) => {
  const [data, setData] = useState(candidateData);
  const [loading, setLoading] = useState(false);

  // Simulate loading data
  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const updateProfile = (updates) => {
    setData(prev => ({
      ...prev,
      profile: { ...prev.profile, ...updates }
    }));
  };

  const addUpcomingInterview = (interview) => {
    setData(prev => ({
      ...prev,
      upcomingInterviews: [...prev.upcomingInterviews, { ...interview, id: Date.now() }]
    }));
  };

  const updateAnalytics = (newAnalytics) => {
    setData(prev => ({
      ...prev,
      analytics: { ...prev.analytics, ...newAnalytics }
    }));
  };

  const value = {
    data,
    loading,
    updateProfile,
    addUpcomingInterview,
    updateAnalytics
  };

  return (
    <CandidateContext.Provider value={value}>
      {children}
    </CandidateContext.Provider>
  );
};