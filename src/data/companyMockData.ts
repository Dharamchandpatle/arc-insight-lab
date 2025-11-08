export const companyData = {
  profile: {
    companyName: 'AI-NEXUS Technologies',
    head: 'Dharamchand Patle',
    employees: 42,
  },
  hrList: [
    { id: 1, name: 'Rahul Patil', role: 'HR Manager', active: true, interviewsToday: 3 },
    { id: 2, name: 'Neelesh Kumar', role: 'HR Associate', active: true, interviewsToday: 2 },
    { id: 3, name: 'Mayank Pradkar', role: 'Recruiter', active: false, interviewsToday: 0 },
  ],
  departments: [
    { name: 'Engineering', totalPositions: 8, filled: 6 },
    { name: 'Design', totalPositions: 4, filled: 3 },
    { name: 'Marketing', totalPositions: 3, filled: 2 },
  ],
  jobPostings: [
    { id: 1, title: 'Frontend Developer', applicants: 45, status: 'Open' },
    { id: 2, title: 'Backend Engineer', applicants: 32, status: 'Screening' },
    { id: 3, title: 'UI/UX Designer', applicants: 28, status: 'Closed' },
  ],
  analytics: {
    totalInterviews: 48,
    avgJDMatch: 82,
    avgCommunication: 79,
    avgAIScore: 85,
    candidateGrowth: [12, 18, 22, 28, 35],
    interviewTrend: [5, 9, 12, 15, 18],
  },
  aiInsights: [
    { metric: 'Hiring Efficiency', value: '+12%', note: 'Improved from last month' },
    { metric: 'Average JD Match', value: '82%', note: 'High alignment with roles' },
    { metric: 'Interview Completion Rate', value: '95%', note: 'Great scheduling consistency' },
  ],
  notifications: [
    { id: 1, text: 'New HR added: Neelesh Kumar', read: false },
    { id: 2, text: 'Interview completed: Frontend Intern – Neha Sharma', read: false },
    { id: 3, text: 'AI feedback summary updated', read: false },
  ],
};

export type CompanyData = typeof companyData;
