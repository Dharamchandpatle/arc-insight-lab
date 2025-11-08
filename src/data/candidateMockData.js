export const candidateData = {
  profile: {
    name: "Neha Sharma",
    role: "Frontend Developer Intern",
    level: "Intermediate",
    jdMatch: 87,
    communication: 82,
    overallScore: 84,
    avatar: "/avatars/neha.png",
  },
  upcomingInterviews: [
    { id: 1, company: "Google", role: "Frontend Intern", date: "2025-11-15", time: "10:30 AM" },
    { id: 2, company: "Microsoft", role: "React Developer", date: "2025-11-18", time: "2:00 PM" },
  ],
  history: [
    { id: 1, company: "Amazon", date: "2025-10-25", feedbackScore: 80, jdMatch: 85, communication: 78, result: "Shortlisted" },
    { id: 2, company: "Infosys", date: "2025-10-10", feedbackScore: 76, jdMatch: 72, communication: 82, result: "Pending" },
  ],
  aiFeedback: [
    { question: "Tell me about yourself.", feedback: "Great confidence, but improve pacing.", score: 8 },
    { question: "Explain React lifecycle.", feedback: "Excellent clarity and depth.", score: 9 },
  ],
  analytics: {
    jdMatchTrend: [80, 82, 83, 85, 87],
    communicationTrend: [78, 79, 81, 83, 82],
    feedbackTrend: [75, 78, 80, 83, 84],
  },
  // Practice questions for interactive practice mode
  practiceQuestions: [
    {
      id: 1,
      question: "What is a React Hook?",
      options: [
        "A special kind of component",
        "A function that lets you use state and other React features",
        "A routing library",
        "A CSS-in-JS solution"
      ],
      correctIndex: 1,
      topic: "React",
      difficulty: "Easy",
      explanation: "Hooks are functions like useState and useEffect that let you use React features without writing a class.",
      timeLimitSec: 60
    },
    {
      id: 2,
      question: "Which method is used to update state in a class component?",
      options: ["setState", "updateState", "changeState", "modifyState"],
      correctIndex: 0,
      topic: "React",
      difficulty: "Easy",
      explanation: "In class components, setState is used to update the component's state.",
      timeLimitSec: 60
    },
    {
      id: 3,
      question: "What does CSS specificity determine?",
      options: ["The color of text","Which CSS rule applies when multiple rules target the same element","The order of script execution","Load order of external resources"],
      correctIndex: 1,
      topic: "CSS",
      difficulty: "Medium",
      explanation: "Specificity determines which CSS rule takes precedence when multiple rules match the same element.",
      timeLimitSec: 60
    },
    {
      id: 4,
      question: "Which HTTP status code indicates 'Not Found'?",
      options: ["200","301","404","500"],
      correctIndex: 2,
      topic: "Web",
      difficulty: "Easy",
      explanation: "404 is the standard HTTP status code for 'Not Found'.",
      timeLimitSec: 45
    },
    {
      id: 5,
      question: "In JavaScript, which keyword creates a block-scoped variable?",
      options: ["var","let","function","constonly"],
      correctIndex: 1,
      topic: "JavaScript",
      difficulty: "Easy",
      explanation: "let (and const) create block-scoped variables, whereas var is function-scoped.",
      timeLimitSec: 45
    },
    {
      id: 6,
      question: "What's the time complexity of binary search on a sorted array?",
      options: ["O(n)","O(log n)","O(n log n)","O(1)"],
      correctIndex: 1,
      topic: "Algorithms",
      difficulty: "Medium",
      explanation: "Binary search halves the search space each step, giving O(log n) time.",
      timeLimitSec: 75
    },
    {
      id: 7,
      question: "Which HTML element is used to embed JavaScript?",
      options: ["<script>","<js>","<code>","<embed>"],
      correctIndex: 0,
      topic: "HTML",
      difficulty: "Easy",
      explanation: "The <script> tag is used to embed or reference JavaScript in HTML.",
      timeLimitSec: 30
    },
    {
      id: 8,
      question: "Which of the following is a semantic HTML element?",
      options: ["<div>","<span>","<header>","<b>"],
      correctIndex: 2,
      topic: "HTML",
      difficulty: "Easy",
      explanation: "<header> is semantic and indicates header content; div/span are generic containers.",
      timeLimitSec: 45
    },
    {
      id: 9,
      question: "What is CORS used for?",
      options: ["Optimizing images","Controlling cross-origin resource access","Compression","Encrypting requests"],
      correctIndex: 1,
      topic: "Web",
      difficulty: "Medium",
      explanation: "CORS (Cross-Origin Resource Sharing) configures how browsers permit cross-origin requests.",
      timeLimitSec: 60
    },
    {
      id: 10,
      question: "Which data structure uses FIFO ordering?",
      options: ["Stack","Queue","Tree","Graph"],
      correctIndex: 1,
      topic: "Data Structures",
      difficulty: "Easy",
      explanation: "Queue uses First-In-First-Out ordering.",
      timeLimitSec: 45
    },
    {
      id: 11,
      question: "Which hook runs after every render when dependencies change?",
      options: ["useMemo","useEffect","useCallback","useRef"],
      correctIndex: 1,
      topic: "React",
      difficulty: "Medium",
      explanation: "useEffect runs after render and can depend on a dependencies array to control when it runs.",
      timeLimitSec: 60
    },
    {
      id: 12,
      question: "Which CSS property controls the stacking order?",
      options: ["z-index","order","stacking","display"],
      correctIndex: 0,
      topic: "CSS",
      difficulty: "Easy",
      explanation: "z-index controls stack order for positioned elements.",
      timeLimitSec: 45
    },
    {
      id: 13,
      question: "Which of these is NOT a JavaScript primitive?",
      options: ["string","object","number","boolean"],
      correctIndex: 1,
      topic: "JavaScript",
      difficulty: "Medium",
      explanation: "Object is not a primitive; primitives are string, number, boolean, null, undefined, symbol, bigint.",
      timeLimitSec: 60
    },
    {
      id: 14,
      question: "What does REST stand for?",
      options: ["Representational State Transfer","Remote Execution Service Tool","Rapid Endpoint Service Transfer","None of the above"],
      correctIndex: 0,
      topic: "Web",
      difficulty: "Easy",
      explanation: "REST stands for Representational State Transfer and is an architectural style for web services.",
      timeLimitSec: 60
    },
    {
      id: 15,
      question: "Which of the following promises to never mutate the original array when used?",
      options: ["Array.prototype.sort","Array.prototype.map","Array.prototype.push","Array.prototype.unshift"],
      correctIndex: 1,
      topic: "JavaScript",
      difficulty: "Medium",
      explanation: "map returns a new array and does not mutate the original; push and unshift mutate, sort mutates.",
      timeLimitSec: 75
    }
  ],
  practiceScores: []
};