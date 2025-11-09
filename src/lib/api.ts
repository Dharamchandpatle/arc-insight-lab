/**
 * API Service for Backend Communication
 * Handles all HTTP requests to the AI-NEXUS backend
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:5000/ws/audio';

// Helper function to get auth token from localStorage
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Helper function to set auth token
export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

// Helper function to remove auth token
export const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

// Generic fetch wrapper with auth
const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Unauthorized - clear token and redirect to login
      removeAuthToken();
      throw new Error('Unauthorized - Please login again');
    }
    const error = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(error.error || `HTTP error! status: ${response.status}`);
  }

  return response;
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  register: async (email: string, password: string, name: string, role: 'HR_Recruiter' | 'Student_Candidate') => {
    const response = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name, role }),
    });
    const data = await response.json();
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  logout: () => {
    removeAuthToken();
  },
};

// Interviews API
export const interviewsAPI = {
  getAll: async () => {
    const response = await apiRequest('/interviews');
    return response.json();
  },

  getById: async (interviewId: string) => {
    const response = await apiRequest(`/interviews/${interviewId}`);
    return response.json();
  },

  schedule: async (candidateId: string, scheduledAt: string, jobDescription?: string | File) => {
    const formData = new FormData();
    formData.append('candidateId', candidateId);
    formData.append('scheduledAt', scheduledAt);
    
    if (jobDescription instanceof File) {
      formData.append('jobDescription', jobDescription);
    } else if (jobDescription) {
      formData.append('jobDescriptionText', jobDescription);
    }

    const token = getAuthToken();
    const headers: HeadersInit = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/interviews/schedule`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  getToken: async (interviewId: string) => {
    const response = await apiRequest(`/interviews/${interviewId}/token`, {
      method: 'POST',
    });
    return response.json();
  },

  start: async (interviewId: string) => {
    const response = await apiRequest(`/interviews/${interviewId}/start`, {
      method: 'POST',
    });
    return response.json();
  },

  // Spike endpoint (no auth required)
  getSpikeToken: async (roomName: string, role: 'hr' | 'candidate') => {
    const response = await fetch(`${API_BASE_URL}/interviews/spike/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roomName, role }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },

  // Save spike interview data (no auth required)
  saveSpikeInterview: async (roomName: string, transcripts: any[], qaPairs: any[], hrId?: string, candidateId?: string) => {
    const response = await fetch(`${API_BASE_URL}/interviews/spike/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ roomName, transcripts, qaPairs, hrId, candidateId }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};

// Reports API
export const reportsAPI = {
  getAll: async () => {
    const response = await apiRequest('/reports');
    return response.json();
  },

  getByInterviewId: async (interviewId: string) => {
    const response = await apiRequest(`/reports/${interviewId}`);
    return response.json();
  },
};

// Ollama API
export const ollamaAPI = {
  generateIdealAnswer: async (question: string, jobDescription?: string) => {
    const response = await apiRequest('/ollama/generate-ideal-answer', {
      method: 'POST',
      body: JSON.stringify({ question, jobDescription }),
    });
    return response.json();
  },

  scoreAnswer: async (question: string, candidateAnswer: string, idealAnswer: string, jobDescription?: string) => {
    const response = await apiRequest('/ollama/score-answer', {
      method: 'POST',
      body: JSON.stringify({ question, candidateAnswer, idealAnswer, jobDescription }),
    });
    return response.json();
  },

  generateReport: async (interviewId: string, transcripts: any[], qaPairs: any[], jobDescription?: string) => {
    const response = await fetch(`${API_BASE_URL}/ollama/generate-report`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ interviewId, transcripts, qaPairs, jobDescription }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: response.statusText }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  },
};

// Health check
export const healthCheck = async () => {
  const response = await fetch(`${API_BASE_URL}/health`);
  return response.json();
};

// WebSocket URL helper
export const getWebSocketUrl = (): string => {
  return WS_URL;
};

