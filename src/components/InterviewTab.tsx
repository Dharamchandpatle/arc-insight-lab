import React, { useEffect, useRef, useState } from "react";
import { fetchAiResponse } from "../lib/aiMock";
import { createMicrophoneAnalyser, getAmplitudeFromAnalyser } from "../lib/audioUtils";

const InterviewTab: React.FC = () => {
  const [running, setRunning] = useState(false);
  const [candidateLines, setCandidateLines] = useState<string[]>([]);
  const [hrLines, setHrLines] = useState<string[]>([]);
  const [mouthPower, setMouthPower] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);

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
        if (running) r.start();
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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-heading mb-2">Live Interview Session</h2>
        <p className="text-muted-foreground">Practice your interview skills with AI-powered feedback</p>
        <p className="text-sm text-green-600 mt-2">✅ InterviewTab is loaded and working!</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">You</h3>
            <div className="w-32 h-12 bg-blue-100 rounded flex items-center justify-center">
              <span className="text-xs">Wave: {(mouthPower * 100).toFixed(0)}%</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-xl h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-white text-2xl">👤</span>
              </div>
              <p className="text-sm">Candidate Avatar</p>
              <p className="text-xs text-gray-500">Mouth: {(mouthPower * 100).toFixed(0)}%</p>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">AI Interviewer</h3>
            <div className="w-32 h-12 bg-purple-100 rounded flex items-center justify-center">
              <span className="text-xs">Wave: {running ? '40%' : '0%'}</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-xl h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full mx-auto mb-2 flex items-center justify-center">
                <span className="text-white text-2xl">🤖</span>
              </div>
              <p className="text-sm">AI Interviewer</p>
              <p className="text-xs text-gray-500">Status: {running ? 'Active' : 'Inactive'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="bg-card p-4 rounded-xl border min-h-32">
            <h4 className="font-semibold mb-2">Live Transcription</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {candidateLines.length === 0 && hrLines.length === 0 && (
                <p className="text-sm text-gray-500 italic">Start the interview to see transcription...</p>
              )}
              {candidateLines.map((line, i) => (
                <div key={`candidate-${i}`} className="text-sm p-2 bg-blue-50 rounded">
                  <strong className="text-blue-700">You:</strong> {line}
                </div>
              ))}
              {hrLines.map((line, i) => (
                <div key={`hr-${i}`} className="text-sm p-2 bg-purple-50 rounded">
                  <strong className="text-purple-700">AI Interviewer:</strong> {line}
                </div>
              ))}
            </div>
          </div>
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
                    const ut = new SpeechSynthesisUtterance(reply);
                    ut.lang = "en-US";
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