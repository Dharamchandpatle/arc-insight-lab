import React from 'react';

interface ControlBarProps {
  micOn: boolean;
  camOn: boolean;
  onToggleMic: () => void;
  onToggleCam: () => void;
  onShowTranscript: () => void;
  onGetFeedback: () => void;
  onEnd: () => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({ micOn, camOn, onToggleMic, onToggleCam, onShowTranscript, onGetFeedback, onEnd }) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 glass px-4 py-3 rounded-full flex items-center gap-3 shadow-lg">
      <button onClick={onToggleMic} aria-label="Toggle microphone" className={`px-3 py-2 rounded flex items-center gap-2 ${micOn ? 'bg-[#00BFFF] text-black' : 'bg-white/5 text-white'}`}>
        {micOn ? 'Mic On' : 'Mic Off'}
      </button>
      <button onClick={onToggleCam} aria-label="Toggle camera" className={`px-3 py-2 rounded flex items-center gap-2 ${camOn ? 'bg-[#00BFFF] text-black' : 'bg-white/5 text-white'}`}>
        {camOn ? 'Cam On' : 'Cam Off'}
      </button>
      <button onClick={onShowTranscript} aria-label="Show transcript" className="px-3 py-2 rounded bg-white/5">Transcript</button>
      <button onClick={onGetFeedback} aria-label="Get AI feedback" className="px-3 py-2 rounded bg-gradient-to-r from-[#00BFFF] to-[#1E90FF] text-black">AI Feedback</button>
      <button onClick={onEnd} aria-label="End interview" className="px-3 py-2 rounded bg-rose-500 text-white">End</button>
    </div>
  );
};

export default ControlBar;
