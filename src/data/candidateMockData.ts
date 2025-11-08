export const candidateData = {
  profile: {
    name: "Neha Sharma",
    role: "Frontend Developer Intern",
    level: "Intermediate",
    avatar: "/avatars/neha.png",
    jdMatch: 87,
    communication: 82,
    overallScore: 84,
  },
  upcomingInterviews: [
    { id: 1, company: "Google", role: "Frontend Intern", date: "2025-11-15", time: "10:30 AM" },
    { id: 2, company: "Microsoft", role: "React Developer", date: "2025-11-18", time: "2:00 PM" },
  ],
  history: [
    { id: 101, company: "Amazon", date: "2025-10-25", feedbackScore: 80, jdMatch: 85, communication: 78, result: "Shortlisted", role: "Frontend" },
    { id: 102, company: "Infosys", date: "2025-10-10", feedbackScore: 76, jdMatch: 72, communication: 82, result: "Pending", role: "Frontend" },
  ],
  aiFeedback: [
    { question: "Tell me about yourself.", feedback: "Good structure. Improve pacing and clarity.", score: 8 },
    { question: "What is React used for?", feedback: "Strong technical understanding. Great confidence.", score: 9 },
  ],
  analytics: {
    jdMatchTrend: [80, 82, 83, 85, 87],
    communicationTrend: [78, 79, 81, 83, 82],
    feedbackTrend: [75, 78, 80, 83, 84],
    labels: ["Week -4", "Week -3", "Week -2", "Last Week", "This Week"],
  },
};

export default candidateData;
