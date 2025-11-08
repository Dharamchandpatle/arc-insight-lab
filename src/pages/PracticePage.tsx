import { ArrowLeft, ArrowRight } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCandidate } from "../context/CandidateContext";

const PracticePage: React.FC = () => {
  const { data, loading, setData } = useCandidate();
  const navigate = useNavigate();

  const questions = data.practiceQuestions || [];
  const total = questions.length;

  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<number, { selected: number | null; correct: boolean }>>({});
  const [finished, setFinished] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  // initialize timer for current question
  useEffect(() => {
    if (!questions[index]) return;
    setSelected(answers[questions[index].id]?.selected ?? null);
    setTimeLeft(questions[index].timeLimitSec ?? null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  useEffect(() => {
    if (timeLeft === null) return;
    if (finished) return;
    if (timeLeft <= 0) {
      // auto-mark as incorrect and advance
      handleSubmit();
      return;
    }
    const t = setTimeout(() => setTimeLeft((t) => (t !== null ? t - 1 : t)), 1000);
    return () => clearTimeout(t);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, finished]);

  const correctCount = useMemo(() => Object.values(answers).filter(a => a.correct).length, [answers]);

  const handleSelect = (i: number) => {
    setSelected(i);
  };

  const handleSubmit = () => {
    if (!questions[index]) return;
    const q = questions[index];
    // prevent double submit for same question
    if (answers[q.id]) return;
    const chosen = selected;
    const correct = chosen === q.correctIndex;
    setAnswers(prev => ({ ...prev, [q.id]: { selected: chosen, correct } }));
    // if last question, finish
    if (index === total - 1) {
      setFinished(true);
      // persist score in context
      const scoreObj = {
        id: Date.now(),
        date: new Date().toISOString(),
        total,
        correct: Object.values({ ...answers, [q.id]: { selected: chosen, correct } }).filter(a => a.correct).length
      };
      setData((d: any) => ({ ...d, practiceScores: [...(d.practiceScores || []), scoreObj] }));
      return;
    }
    // move next and reset selection for next question
    setIndex(i => Math.min(total - 1, i + 1));
    setSelected(null);
  };

  const handlePrev = () => {
    setIndex(i => Math.max(0, i - 1));
  };

  const restart = () => {
    setIndex(0);
    setAnswers({});
    setSelected(null);
    setFinished(false);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  if (!questions.length) return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold">Practice</h2>
      <p className="text-gray-400 mt-2">No practice questions are available.</p>
      <button onClick={() => navigate('/candidate-dashboard')} className="mt-4 px-4 py-2 bg-[#00BFFF] rounded text-white">Back</button>
    </div>
  );

  if (finished) {
    const correct = Object.values(answers).filter(a => a.correct).length;
    const percentage = Math.round((correct / total) * 100);
    const lastScore = (data.practiceScores && data.practiceScores[data.practiceScores.length - 1]) || null;

    return (
      <div className="container mx-auto p-6">
        <div className="bg-[#0A0E2A]/70 p-6 rounded-lg border border-[#00BFFF]/20">
          <h2 className="text-2xl font-orbitron font-bold mb-2 text-[#00BFFF]">Practice Scorecard</h2>
          <p className="text-white text-lg">You scored <span className="font-bold">{correct}</span> out of <span className="font-bold">{total}</span> ({percentage}%).</p>
          {lastScore && <p className="text-gray-400 text-sm mt-2">Saved at {new Date(lastScore.date).toLocaleString()}</p>}

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {questions.map((q) => {
              const ans = answers[q.id];
              const chosen = ans?.selected;
              const isCorrect = !!ans?.correct;
              return (
                <div key={q.id} className="p-4 bg-[#081026] rounded border border-[#233b4a]">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-gray-300">{q.topic} • {q.difficulty}</div>
                    <div className={`text-sm ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>{isCorrect ? 'Correct' : 'Incorrect'}</div>
                  </div>
                  <div className="text-white mb-2">{q.question}</div>
                  <div className="text-sm text-gray-300 mb-2">Your answer: <span className="text-white">{chosen !== null && chosen !== undefined ? q.options[chosen] : 'No answer'}</span></div>
                  <div className="text-sm text-gray-300 mb-2">Correct: <span className="text-white">{q.options[q.correctIndex]}</span></div>
                  <div className="text-xs text-gray-400">{q.explanation}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={restart} className="px-4 py-2 bg-[#00BFFF] text-white rounded">Retry</button>
            <button onClick={() => navigate('/candidate-dashboard')} className="px-4 py-2 border border-[#00BFFF] text-[#00BFFF] rounded">Back to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[index];

  return (
    <div className="container mx-auto p-6">
      <div className="bg-[#0A0E2A]/70 p-6 rounded-lg border border-[#00BFFF]/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-orbitron font-bold text-[#00BFFF]">Practice Mode</h2>
          <div className="text-sm text-gray-300">Question {index + 1} / {total}</div>
        </div>

        <div className="mb-4">
          <div className="text-white text-lg mb-2">{q.question}</div>
          <div className="text-sm text-gray-400 mb-2">Topic: {q.topic} • Difficulty: {q.difficulty}</div>
          {timeLeft !== null && <div className="text-xs text-gray-500">Time left: {timeLeft}s</div>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {q.options.map((opt, i) => {
            const answered = answers[q.id];
            const isSelected = selected === i;
            const showCorrect = answered !== undefined;
            const isCorrectOption = q.correctIndex === i;
            const bgClass = showCorrect ? (isCorrectOption ? 'bg-green-600/40 border-green-500' : (isSelected ? 'bg-red-700/40 border-red-500' : 'bg-transparent')) : (isSelected ? 'bg-[#00BFFF]/20 border-[#00BFFF]/40' : 'bg-[#ffffff0a]');
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                disabled={!!answers[q.id]}
                className={`text-left p-3 rounded-lg border ${bgClass} border-[#2b3b45]`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isSelected ? 'bg-[#00BFFF] text-black' : 'bg-[#ffffff10]'}`}>{String.fromCharCode(65 + i)}</div>
                  <div className="text-white">{opt}</div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex gap-3">
            <button onClick={handlePrev} disabled={index === 0} className="px-3 py-2 border border-[#00BFFF] text-[#00BFFF] rounded flex items-center gap-2"><ArrowLeft />Prev</button>
            <button onClick={handleSubmit} className="px-3 py-2 bg-[#00BFFF] text-white rounded flex items-center gap-2">Submit<ArrowRight /></button>
          </div>
          <div className="text-sm text-gray-400">Correct so far: <span className="text-[#00BFFF] font-semibold">{correctCount}</span></div>
        </div>
      </div>
    </div>
  );
};

export default PracticePage;
