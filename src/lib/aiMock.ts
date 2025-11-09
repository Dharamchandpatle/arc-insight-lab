import { ollamaAPI } from "./api";

export const mockResponses = [
  "That's an interesting answer. Can you elaborate on your project role?",
  "Good. Tell me how you handle teamwork under deadlines.",
  "What motivates you to join this position?",
  "Thanks — can you walk me through a technical challenge you faced?",
  "Great. How do you prioritize tasks when timelines shift?",
];

let idx = 0;

/**
 * Fetch AI response from backend Ollama API
 * Falls back to mock responses if API fails
 */
export async function fetchAiResponse(prompt?: string, jobDescription?: string): Promise<string> {
  try {
    // If we have a prompt/question, use the Ollama API
    if (prompt && prompt.trim()) {
      const response = await ollamaAPI.generateIdealAnswer(prompt, jobDescription);
      return response.idealAnswer || response.response || mockResponses[idx % mockResponses.length];
    }
    
    // If no prompt, return a mock response
    await new Promise((r) => setTimeout(r, 900 + Math.random() * 700));
    const res = mockResponses[idx % mockResponses.length];
    idx += 1;
    return res;
  } catch (error) {
    console.error("AI API error, using mock response:", error);
    // Fallback to mock responses if API fails
    await new Promise((r) => setTimeout(r, 300));
    const res = mockResponses[idx % mockResponses.length];
    idx += 1;
    return res;
  }
}
