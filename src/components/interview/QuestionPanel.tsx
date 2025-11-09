import gsap from 'gsap';
import React from 'react';

interface QuestionPanelProps {
  question: string;
  onNext: () => void;
  onSpeak?: (text: string) => void;
}

export const QuestionPanel: React.FC<QuestionPanelProps> = ({ question, onNext, onSpeak }) => {
  React.useEffect(() => {
    gsap.from('.question-text', { opacity: 0, y: 12, duration: 0.6 });
  }, [question]);

  return (
    <div className="glass p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-orbitron text-[#00BFFF]">Current Question</h3>
        <div className="flex gap-2">
          <button onClick={() => onSpeak?.(question)} className="btn-ghost btn-sm">Speak</button>
          <button onClick={onNext} className="btn btn-sm">Next Question</button>
        </div>
      </div>
      <div className="question-text text-white text-lg font-semibold">{question}</div>
    </div>
  );
};

export default QuestionPanel;
