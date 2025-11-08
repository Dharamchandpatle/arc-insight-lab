import hrDataJson from "@/mockData/hrData.json";import hrDataJson from "@/mockData/hrData.json";import hrDataJson from "@/mockData/hrData.json";import hrDataJson from "@/mockData/hrData.json";



export interface Interview {

  id: number;

  candidate: string;export interface Interview {

  role: string;

  date: string;  id: number;

  time?: string;

  status: string;  candidate: string;export interface Interview {export interface Interview {

}

  role: string;

export interface JDItem {

  id: number;  date: string;  id: number;  id: number;

  title: string;

  department?: string;  time?: string;

  skills?: string[];

  text?: string;  status: string;  candidate: string;  candidate: string;

  createdAt: string;

}}



export interface Analytics {  role: string;  role: string;

  topCandidate: string;

  avgJDMatch: number;export interface JDItem {

  feedbackReports: number;

}  id: number;  date: string;  date: string;



const INTERVIEWS_KEY = "hr-interviews";  title: string;

const JDS_KEY = "hr-jds";

const ANALYTICS_KEY = "hr-analytics";  department?: string;  time?: string;  time?: string;



export const getInterviews = (): Interview[] => {  skills?: string[];

  try {

    const raw = localStorage.getItem(INTERVIEWS_KEY);  text?: string;  status: string;  status: string;

    if (raw) return JSON.parse(raw) as Interview[];

  } catch (e) {  createdAt: string;

    console.error("Failed to parse interviews from localStorage", e);

  }}}}

  return hrDataJson.upcomingInterviews as Interview[];

};



export const saveInterviews = (items: Interview[]) => {export interface Analytics {

  localStorage.setItem(INTERVIEWS_KEY, JSON.stringify(items));

};  topCandidate: string;



export const getJDs = (): JDItem[] => {  avgJDMatch: number;export interface JDItem {export interface JDItem {

  try {

    const raw = localStorage.getItem(JDS_KEY);  feedbackReports: number;

    if (raw) return JSON.parse(raw) as JDItem[];

  } catch (e) {}  id: number;  id: number;

    console.error("Failed to parse JDs from localStorage", e);

  }

  return [];

};const INTERVIEWS_KEY = "hr-interviews";  title: string;  title: string;



export const saveJDs = (items: JDItem[]) => {const JDS_KEY = "hr-jds";

  localStorage.setItem(JDS_KEY, JSON.stringify(items));

};const ANALYTICS_KEY = "hr-analytics";  department?: string;  department?: string;



export const getAnalytics = (): Analytics => {

  try {

    const raw = localStorage.getItem(ANALYTICS_KEY);export const getInterviews = (): Interview[] => {  skills?: string[];  skills?: string[];

    if (raw) return JSON.parse(raw) as Analytics;

  } catch (e) {  try {

    console.error("Failed to parse analytics from localStorage", e);

  }    const raw = localStorage.getItem(INTERVIEWS_KEY);  text?: string;  text?: string;

  return hrDataJson.analytics as Analytics;

};    if (raw) return JSON.parse(raw) as Interview[];



export const saveAnalytics = (a: Analytics) => {  } catch (e) {  createdAt: string;  createdAt: string;

  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(a));

};    console.error("Failed to parse interviews from localStorage", e);



export const getChartData = () => ({  }}}

  jdMatchScores: [

    { name: "Neha Sharma", score: 87 },  return hrDataJson.upcomingInterviews as Interview[];

    { name: "Rahul Patil", score: 75 },

    { name: "Priya Desai", score: 92 },};

    { name: "Arjun Kumar", score: 68 },

  ],

  skillDistribution: [

    { name: "React", value: 30 },export const saveInterviews = (items: Interview[]) => {export interface Analytics {export interface Analytics {

    { name: "TypeScript", value: 25 },

    { name: "Python", value: 20 },  localStorage.setItem(INTERVIEWS_KEY, JSON.stringify(items));

    { name: "Node.js", value: 15 },

    { name: "Others", value: 10 },};  topCandidate: string;  topCandidate: string;

  ],

});

export const getJDs = (): JDItem[] => {  avgJDMatch: number;  avgJDMatch: number;

  try {

    const raw = localStorage.getItem(JDS_KEY);  feedbackReports: number;  feedbackReports: number;

    if (raw) return JSON.parse(raw) as JDItem[];

  } catch (e) {}}

    console.error("Failed to parse JDs from localStorage", e);

  }

  return [];

};const INTERVIEWS_KEY = "hr-interviews";const INTERVIEWS_KEY = "hr-interviews";



export const saveJDs = (items: JDItem[]) => {const JDS_KEY = "hr-jds";const JDS_KEY = "hr-jds";

  localStorage.setItem(JDS_KEY, JSON.stringify(items));

};const ANALYTICS_KEY = "hr-analytics";const ANALYTICS_KEY = "hr-analytics";



export const getAnalytics = (): Analytics => {

  try {

    const raw = localStorage.getItem(ANALYTICS_KEY);export const getInterviews = (): Interview[] => {export const getInterviews = (): Interview[] => {

    if (raw) return JSON.parse(raw) as Analytics;

  } catch (e) {  try {  try {

    console.error("Failed to parse analytics from localStorage", e);

  }    const raw = localStorage.getItem(INTERVIEWS_KEY);    const raw = localStorage.getItem(INTERVIEWS_KEY);

  return hrDataJson.analytics as Analytics;

};    if (raw) return JSON.parse(raw) as Interview[];    if (raw) return JSON.parse(raw) as Interview[];



export const saveAnalytics = (a: Analytics) => {  } catch (e) {  } catch (e) {

  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(a));

};    console.error("Failed to parse interviews from localStorage", e);    console.error("Failed to parse interviews from localStorage", e);



export const getChartData = () => ({  }  }

  jdMatchScores: [

    { name: "Neha Sharma", score: 87 },  return hrDataJson.upcomingInterviews as Interview[];  return hrDataJson.upcomingInterviews as Interview[];

    { name: "Rahul Patil", score: 75 },

    { name: "Priya Desai", score: 92 },};};

    { name: "Arjun Kumar", score: 68 },

  ],

  skillDistribution: [

    { name: "React", value: 30 },export const saveInterviews = (items: Interview[]) => {export const saveInterviews = (items: Interview[]) => {

    { name: "TypeScript", value: 25 },

    { name: "Python", value: 20 },  localStorage.setItem(INTERVIEWS_KEY, JSON.stringify(items));  localStorage.setItem(INTERVIEWS_KEY, JSON.stringify(items));

    { name: "Node.js", value: 15 },

    { name: "Others", value: 10 },};};

  ],

});

export const getJDs = (): JDItem[] => {export const getJDs = (): JDItem[] => {

  try {  try {

    const raw = localStorage.getItem(JDS_KEY);    const raw = localStorage.getItem(JDS_KEY);

    if (raw) return JSON.parse(raw) as JDItem[];    if (raw) return JSON.parse(raw) as JDItem[];

  } catch (e) {  } catch (e) {

    console.error("Failed to parse JDs from localStorage", e);    console.error("Failed to parse JDs from localStorage", e);

  }  }

  return [];  return [];

};};



export const saveJDs = (items: JDItem[]) => {export const saveJDs = (items: JDItem[]) => {

  localStorage.setItem(JDS_KEY, JSON.stringify(items));  localStorage.setItem(JDS_KEY, JSON.stringify(items));

};};



export const getAnalytics = (): Analytics => {export const getAnalytics = (): Analytics => {

  try {  try {

    const raw = localStorage.getItem(ANALYTICS_KEY);    const raw = localStorage.getItem(ANALYTICS_KEY);

    if (raw) return JSON.parse(raw) as Analytics;    if (raw) return JSON.parse(raw) as Analytics;

  } catch (e) {  } catch (e) {

    console.error("Failed to parse analytics from localStorage", e);    console.error("Failed to parse analytics from localStorage", e);

  }  }

  return hrDataJson.analytics as Analytics;  return hrDataJson.analytics as Analytics;

};};



export const saveAnalytics = (a: Analytics) => {export const saveAnalytics = (a: Analytics) => {

  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(a));  localStorage.setItem(ANALYTICS_KEY, JSON.stringify(a));

};};



export const getChartData = () => ({export const getChartData = () => ({

  jdMatchScores: [  jdMatchScores: [

    { name: "Neha Sharma", score: 87 },    { name: "Neha Sharma", score: 87 },

    { name: "Rahul Patil", score: 75 },    { name: "Rahul Patil", score: 75 },

    { name: "Priya Desai", score: 92 },    { name: "Priya Desai", score: 92 },

    { name: "Arjun Kumar", score: 68 },    { name: "Arjun Kumar", score: 68 },

  ],  ],

  skillDistribution: [  skillDistribution: [

    { name: "React", value: 30 },    { name: "React", value: 30 },

    { name: "TypeScript", value: 25 },    { name: "TypeScript", value: 25 },

    { name: "Python", value: 20 },    { name: "Python", value: 20 },

    { name: "Node.js", value: 15 },    { name: "Node.js", value: 15 },

    { name: "Others", value: 10 },    { name: "Others", value: 10 },

  ],  ],

});});
