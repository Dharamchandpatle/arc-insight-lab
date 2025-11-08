import React, { useEffect, useRef, useState } from "react";
import CandidateAvatar from "../interview/CandidateAvatar";
import HRAvatar, { HRAvatarHandle } from "../interview/HRAvatar";
import TranscriptionPanel from "../interview/TranscriptionPanel";
import WaveVisualizer from "../interview/WaveVisualizer";
import { fetchAiResponse } from "../../lib/aiMock";
import { createMicrophoneAnalyser, getAmplitudeFromAnalyser } from "../../lib/audioUtils";

const InterviewTab: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [candidateLines, setCandidateLines] = useState<string[]>([]);
  const [hrLines, setHrLines] = useState<string[]>([]);
  const [mouthPower, setMouthPower] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

  const hrRef = useRef<HRAvatarHandle | null>(null);

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
    } catch (err) {
      console.warn("Microphone access failed", err);
      return;
    }

    // SpeechRecognition setup
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      const lastResult = event.results[event.results.length - 1];
      if (lastResult.isFinal) {
        const transcript = lastResult[0].transcript.trim();
        if (transcript) {
          setCandidateLines((c) => [...c, transcript]);
          // Trigger AI response after a short delay
          setTimeout(async () => {
            const reply = await fetchAiResponse();
            setHrLines((h) => [...h, reply]);
            hrRef.current?.speakAnimation();
            const ut = new SpeechSynthesisUtterance(reply);
            window.speechSynthesis.speak(ut);
          }, 1000);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
    };

    recognition.onend = () => {
      if (running) {
        // Restart if still running
        try { recognition.start(); } catch (e) {}
      }
    };

    recogRef.current = recognition;
    recognition.start();

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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-heading mb-2">Live Interview Session</h2>
        <p className="text-muted-foreground">Practice your interview skills with AI-powered feedback</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">You</h3>
            <div className="w-32">
              <WaveVisualizer analyser={analyserRef.current} simulatedLevel={mouthPower} />
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl">
            <CandidateAvatar mouthPower={mouthPower} />
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">AI Interviewer</h3>
            <div className="w-32">
              <WaveVisualizer analyser={null} simulatedLevel={running ? 0.4 : 0} />
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl">
            <HRAvatar ref={hrRef} isSpeaking={false} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <TranscriptionPanel candidateText={candidateLines} hrText={hrLines} />
        </div>

        <div className="space-y-4">
          <div className="bg-card p-4 rounded-xl border">
            <p className="text-sm font-semibold mb-3">Controls</p>
            <div className="flex flex-col gap-3">
              {!running ? (
                <button
                  onClick={startInterview}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors"
                >
                  Start Interview
                </button>
              ) : (
                <button
                  onClick={stopInterview}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
                >
                  Stop Interview
                </button>
              )}
              <button
                onClick={() => {
                  // quick trigger HR mock
                  (async () => {
                    const reply = await fetchAiResponse();
                    setHrLines((h) => [...h, reply]);
                    hrRef.current?.speakAnimation();
                    const ut = new SpeechSynthesisUtterance(reply);
                    window.speechSynthesis.speak(ut);
                  })();
                }}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition-colors"
                disabled={!running}
              >
                Simulate Response
              </button>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-xl">
            <strong className="text-sm">Tips</strong>
            <ul className="text-xs mt-2 space-y-1">
              <li>• Allow microphone access when prompted</li>
              <li>• Speak clearly; responses trigger AI feedback</li>
              <li>• Use Chrome/Edge for best experience</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewTab;