import React, { useEffect, useRef, useState } from "react";
import AIFeedbackPanelLocal from "../components/interview/AIFeedbackPanelLocal";
import CandidateAvatar from "../components/interview/CandidateAvatar";
import ControlBar from "../components/interview/ControlBar";
import QuestionPanel from "../components/interview/QuestionPanel";
import TranscriptionPanel from "../components/interview/TranscriptionPanel";
import VideoFeed from "../components/interview/VideoFeed";
import WaveVisualizer from "../components/interview/WaveVisualizer";
import { interviewData } from "../data/interviewMockData";
import { fetchAiResponse } from "../lib/aiMock";
import { createMicrophoneAnalyser, getAmplitudeFromAnalyser } from "../lib/audioUtils";

const InterviewPage: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [candidateLines, setCandidateLines] = useState<string[]>([]);
  const [hrLines, setHrLines] = useState<string[]>([]);
  const [aiItems, setAiItems] = useState<{ question?: string; feedback: string; score?: number }[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [mouthPower, setMouthPower] = useState(0);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCamOn, setIsCamOn] = useState(true);
  const [showSummary, setShowSummary] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const hrRef = useRef<any>(null);

  // SpeechRecognition setup
  const recogRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      // cleanup audio
      if (audioCtxRef.current) audioCtxRef.current.close();
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (recogRef.current) {
        recogRef.current.onend = null;
        try { recogRef.current.stop(); } catch (e) {}
      }
    };
  }, []);

  async function startInterview() {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    const audioCtx = new AudioCtx();
    audioCtxRef.current = audioCtx;

    try {
      const { stream, analyser } = await createMicrophoneAnalyser(audioCtx);
      analyserRef.current = analyser;
      micStreamRef.current = stream;
      // initial mic/cam state derived from tracks
      setIsMicOn(stream.getAudioTracks().some(t => t.enabled));
      setIsCamOn(stream.getVideoTracks().some(t => t.enabled));
    } catch (err) {
      console.warn("Microphone access failed", err);
      return;
    }

    // setup speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const r = new SpeechRecognition();
      r.continuous = true;
      r.interimResults = true;
      r.lang = "en-US";

      let currentLine = "";
  r.onresult = (ev: any) => {
        let interim = "";
        for (let i = ev.resultIndex; i < ev.results.length; ++i) {
          const res = ev.results[i];
          if (res.isFinal) {
            currentLine = (res[0]?.transcript || "").trim();
            if (currentLine) {
              setCandidateLines((s) => [...s, currentLine]);
              // trigger HR reply
              setTimeout(async () => {
                const reply = await fetchAiResponse(currentLine);
                setHrLines((h) => [...h, reply]);
                // HR animate and speak
                if (hrRef.current?.speakAnimation) hrRef.current.speakAnimation();
                const ut = new SpeechSynthesisUtterance(reply);
                ut.lang = "en-US";
                window.speechSynthesis.speak(ut);
              }, 600);
            }
          } else {
            interim += res[0]?.transcript || "";
          }
        }
      };

      r.onend = () => {
        // continue if running
        if (running && isMicOn) r.start();
      };

      r.onerror = (e: any) => {
        console.warn("Speech recognition error", e);
      };

      r.start();
      recogRef.current = r;
    } else {
      console.warn("SpeechRecognition not supported in this browser");
    }

    // sample analyser amplitude
    let raf = 0;
    const update = () => {
      if (analyserRef.current) {
        const amp = getAmplitudeFromAnalyser(analyserRef.current);
        setMouthPower((v) => amp);
      }
      raf = requestAnimationFrame(update);
    };
    update();

    setRunning(true);
  }

  function stopInterview() {
    setRunning(false);
    if (recogRef.current) {
      try { recogRef.current.stop(); } catch (e) {}
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
    if (audioCtxRef.current) {
      try { audioCtxRef.current.close(); } catch (e) {}
      audioCtxRef.current = null;
    }
    setMouthPower(0);
  }

  const toggleMic = () => {
    const s = micStreamRef.current;
    if (!s) return;
    const audioTracks = s.getAudioTracks();
    const next = !isMicOn;
    audioTracks.forEach(t => t.enabled = next);
    setIsMicOn(next);
    // stop/start speech recognition accordingly
    if (recogRef.current) {
      try {
        if (!next) recogRef.current.stop();
        else if (running) recogRef.current.start();
      } catch (e) { /* ignore */ }
    }
  };

  const toggleCam = () => {
    const s = micStreamRef.current;
    if (!s) return;
    const videoTracks = s.getVideoTracks();
    const next = !isCamOn;
    videoTracks.forEach(t => t.enabled = next);
    setIsCamOn(next);
  };

  const handleNextQuestion = () => {
    const next = Math.min(interviewData.questions.length - 1, currentQ + 1);
    setCurrentQ(next);
  };

  const handleSpeak = (text: string) => {
    const ut = new SpeechSynthesisUtterance(text);
    ut.lang = 'en-US';
    window.speechSynthesis.speak(ut);
  };

  const handleGetAI = async () => {
    // generate mock AI feedback for last candidate line
    const last = candidateLines[candidateLines.length - 1] || '';
    const fb = (await fetchAiResponse(last)) || 'Good answer.';
    const score = 7 + Math.floor(Math.random() * 3);
    setAiItems((s) => [{ question: interviewData.questions[currentQ], feedback: fb, score }, ...s]);
    setHrLines((h) => [...h, fb]);
  };

  const handleEnd = () => {
    stopInterview();
    // persist interview to localStorage
    try {
      const history = JSON.parse(localStorage.getItem('interview_history') || '[]');
      const avg = Math.round((aiItems.reduce((s, i) => s + (i.score || 7), 0) / Math.max(1, aiItems.length)));
      history.unshift({ date: new Date().toISOString(), avgScore: avg, transcripts: candidateLines, ai: aiItems });
      localStorage.setItem('interview_history', JSON.stringify(history));
    } catch (e) { /* ignore */ }
    setShowSummary(true);
  };

  return (
    <div className="p-4 bg-gradient-to-b from-[#0A0E2A] to-black text-sky-100">
      <div className="container mx-auto">
        <h1 className="text-2xl font-heading mb-4">3D Interview — Live Session</h1>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <VideoFeed onStream={(s) => { micStreamRef.current = s; }} />
            <div className="flex items-center justify-between">
              <div className="w-48"><WaveVisualizer analyser={analyserRef.current} simulatedLevel={mouthPower} /></div>
              <div className="w-48"><WaveVisualizer analyser={null} simulatedLevel={running ? 0.4 : 0} /></div>
            </div>
            <CandidateAvatar mouthPower={mouthPower} />
          </div>

          <div className="flex-1 space-y-4">
            <QuestionPanel question={interviewData.questions[currentQ]} onNext={handleNextQuestion} onSpeak={handleSpeak} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <TranscriptionPanel candidateText={candidateLines} hrText={hrLines} />
          </div>

          <div className="flex flex-col gap-3">
            <AIFeedbackPanelLocal items={aiItems} />

            <div className="bg-[#021025]/20 p-3 rounded-md text-xs">
              <strong>Tips</strong>
              <ul className="list-disc ml-5 mt-2">
                <li>Allow microphone access when prompted.</li>
                <li>Speak clearly; final sentences trigger HR response.</li>
                <li>Use modern Chrome/Edge for SpeechRecognition support.</li>
              </ul>
            </div>
          </div>
        </div>
        <ControlBar micOn={isMicOn} camOn={isCamOn} onToggleMic={toggleMic} onToggleCam={toggleCam} onShowTranscript={() => {}} onGetFeedback={handleGetAI} onEnd={handleEnd} />

        {/* Summary Modal */}
        {showSummary && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
            <div className="glass p-6 rounded-xl w-full max-w-2xl">
              <h3 className="text-2xl font-orbitron text-[#00BFFF] mb-3">Interview Summary</h3>
              <p className="text-white/80 mb-4">Thank you — the interview session has ended. Below is a brief AI summary.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="p-4 bg-white/5 rounded">
                  <div className="text-sm text-white/60">Average AI Score</div>
                  <div className="text-3xl font-bold text-[#00BFFF]">{Math.round((aiItems.reduce((s, i) => s + (i.score || 7), 0) / Math.max(1, aiItems.length)) || 0)}/10</div>
                </div>
                <div className="p-4 bg-white/5 rounded">
                  <div className="text-sm text-white/60">Top Strength</div>
                  <div className="text-lg font-semibold">Clear technical explanations</div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className="text-sm text-white/70 mb-2">AI feedback snippets</h4>
                <div className="space-y-2 max-h-40 overflow-auto">
                  {aiItems.map((it, i) => (
                    <div key={i} className="p-3 bg-white/3 rounded">{it.feedback}</div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <button onClick={() => setShowSummary(false)} className="px-4 py-2 rounded bg-white/10">Close</button>
                <button onClick={() => { setShowSummary(false); navigate('/candidate-dashboard'); }} className="px-4 py-2 rounded bg-gradient-to-r from-[#00BFFF] to-[#1E90FF] text-black">Back to Dashboard</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewPage;

