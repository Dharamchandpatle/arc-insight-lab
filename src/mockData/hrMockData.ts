// Types
export interface Interview {
  id: number;
  candidate: string;
  role: string;
  date: string;
  time: string;
  status: string;
}

export interface Analytics {
  topCandidate: string;
  avgJDMatch: number;
  feedbackReports: number;
}

export interface HRData {
  upcomingInterviews: Interview[];
  analytics: Analytics;
}

// Mock Data
export const hrData: HRData = {
  upcomingInterviews: [
    {
      id: 1,
      candidate: "Neha Sharma",
      role: "Frontend Intern",
      date: "2025-11-10",
      time: "10:00 AM",
      status: "scheduled"
    },
    {
      id: 2,
      candidate: "Rahul Patil",
      role: "Backend Intern",
      date: "2025-11-11",
      time: "2:30 PM",
      status: "completed"
    },
    {
      id: 3,
      candidate: "Priya Desai",
      role: "Data Science Intern",
      date: "2025-11-12",
      time: "11:00 AM",
      status: "scheduled"
    },
    {
      id: 4,
      candidate: "Arjun Kumar",
      role: "Full Stack Developer",
      date: "2025-11-13",
      time: "3:00 PM",
      status: "scheduled"
    }
  ],
  analytics: {
    topCandidate: "Neha Sharma",
    avgJDMatch: 85,
    feedbackReports: 24
  }
};

// Helper Functions
export const addInterview = (interview: Omit<Interview, "id">): Interview => {
  // Safely calculate next id even if array is empty
  const nextId = hrData.upcomingInterviews.length
    ? Math.max(...hrData.upcomingInterviews.map(i => i.id)) + 1
    : Date.now();
  const newInterview: Interview = {
    ...interview,
    id: nextId,
    // normalize status to lowercase
    status: interview.status ? interview.status.toLowerCase() : 'scheduled'
  };
  hrData.upcomingInterviews.push(newInterview);
  return newInterview;
};

export const updateInterview = (id: number, updates: Partial<Interview>): Interview | null => {
  const index = hrData.upcomingInterviews.findIndex(interview => interview.id === id);
  if (index === -1) return null;
  
  hrData.upcomingInterviews[index] = {
    ...hrData.upcomingInterviews[index],
    ...updates,
    status: updates.status ? updates.status.toLowerCase() : hrData.upcomingInterviews[index].status
  };
  return hrData.upcomingInterviews[index];
};

export const deleteInterview = (id: number): boolean => {
  const index = hrData.upcomingInterviews.findIndex(interview => interview.id === id);
  if (index === -1) return false;
  
  hrData.upcomingInterviews.splice(index, 1);
  return true;
};

export const updateAnalytics = (updates: Partial<Analytics>): Analytics => {
  hrData.analytics = {
    ...hrData.analytics,
    ...updates
  };
  return hrData.analytics;
};