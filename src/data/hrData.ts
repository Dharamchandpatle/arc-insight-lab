import hrDataJson from "@/mockData/hrData.json";

export interface Interview {
  id: number;
  candidate: string;
  role: string;
  date: string;
  time?: string;
  status: string;
}

export interface JDItem {
  id: number;
  title: string;
  department?: string;
  skills?: string[];
  text?: string;
  createdAt: string;
}

export interface Analytics {
  topCandidate: string;
  avgJDMatch: number;
  feedbackReports: number;
}

const INTERVIEWS_KEY = "hr-interviews";
const JDS_KEY = "hr-jds";
const ANALYTICS_KEY = "hr-analytics";

export const getInterviews = (): Interview[] => {
  try {
    const raw = localStorage.getItem(INTERVIEWS_KEY);
    if (raw) return JSON.parse(raw) as Interview[];
  } catch (e) {
    console.error("Failed to parse interviews from localStorage", e);
  }
  return hrDataJson.upcomingInterviews as Interview[];
};

export const saveInterviews = (items: Interview[]) => {
  localStorage.setItem(INTERVIEWS_KEY, JSON.stringify(items));
};

export const getJDs = (): JDItem[] => {
  try {
    const raw = localStorage.getItem(JDS_KEY);
    if (raw) return JSON.parse(raw) as JDItem[];
  } catch (e) {
    console.error("Failed to parse JDs from localStorage", e);
  }
  return [];
};

export const saveJDs = (items: JDItem[]) => {
  localStorage.setItem(JDS_KEY, JSON.stringify(items));
};

export const getAnalytics = (): Analytics => {
  try {
    const raw = localStorage.getItem(ANALYTICS_KEY);
    if (raw) return JSON.parse(raw) as Analytics;
  } catch (e) {
    console.error("Failed to parse analytics from localStorage", e);
  }
  return hrDataJson.analytics as Analytics;
};

export const saveAnalytics = (a: Analytics) => {
  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(a));
};

export const getChartData = () => ({
  jdMatchScores: [
    { name: "Neha Sharma", score: 87 },
    { name: "Rahul Patil", score: 75 },
    { name: "Priya Desai", score: 92 },
    { name: "Arjun Kumar", score: 68 },
  ],
  skillDistribution: [
    { name: "React", value: 30 },
    { name: "TypeScript", value: 25 },
    { name: "Python", value: 20 },
    { name: "Node.js", value: 15 },
    { name: "Others", value: 10 },
  ],
});
