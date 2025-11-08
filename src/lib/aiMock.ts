export const mockResponses = [
  "That’s an interesting answer. Can you elaborate on your project role?",
  "Good. Tell me how you handle teamwork under deadlines.",
  "What motivates you to join this position?",
  "Thanks — can you walk me through a technical challenge you faced?",
  "Great. How do you prioritize tasks when timelines shift?",
];

let idx = 0;

export async function fetchAiResponse(prompt?: string) {
  // simple mock: rotate through responses with a small delay
  await new Promise((r) => setTimeout(r, 900 + Math.random() * 700));
  const res = mockResponses[idx % mockResponses.length];
  idx += 1;
  return res;
}
