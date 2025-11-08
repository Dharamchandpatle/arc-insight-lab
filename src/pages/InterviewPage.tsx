import React, { useEffect, useRef, useState } from "react";
import CandidateAvatar from "../components/interview/CandidateAvatar";
import TranscriptionPanel from "../components/interview/TranscriptionPanel";
import WaveVisualizer from "../components/interview/WaveVisualizer";
import { fetchAiResponse } from "../lib/aiMock";
import { createMicrophoneAnalyser, getAmplitudeFromAnalyser } from "../lib/audioUtils";

const InterviewPage: React.FC = () => {
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
      r.onresult = (ev: SpeechRecognitionEvent) => {
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
                hrRef.current?.speakAnimation();
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
    <div className="p-4 bg-gradient-to-b from-[#0A0E2A] to-black text-sky-100">
      <div className="container mx-auto">
        <h1 className="text-2xl font-heading mb-4">3D Interview — Live Session</h1>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg">Candidate</h2>
              <div className="w-48">
                <WaveVisualizer analyser={analyserRef.current} simulatedLevel={mouthPower} />
              </div>
            </div>

            <CandidateAvatar mouthPower={mouthPower} />
          </div>

          <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg">HR Interviewer</h2>
              <div className="w-48">
                <WaveVisualizer analyser={null} simulatedLevel={running ? 0.4 : 0} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <TranscriptionPanel candidateText={candidateLines} hrText={hrLines} />
          </div>

          <div className="flex flex-col gap-3">
            <div className="bg-[#021025]/40 p-4 rounded-md">
              <p className="text-sm">Control</p>
              <div className="mt-3 flex gap-2">
                {!running ? (
                  <button onClick={startInterview} className="px-3 py-2 rounded bg-sky-500 text-black">Start</button>
                ) : (
                  <button onClick={stopInterview} className="px-3 py-2 rounded bg-rose-500 text-white">Stop</button>
                )}
                <button onClick={() => {
                  // quick trigger HR mock
                  (async () => {
                    const reply = await fetchAiResponse();
                    setHrLines((h) => [...h, reply]);
                    const ut = new SpeechSynthesisUtterance(reply);
                    window.speechSynthesis.speak(ut);
                  })();
                }} className="px-3 py-2 rounded border border-sky-600">Simulate HR</button>
              </div>
            </div>

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
      </div>
    </div>
  );
};

export default InterviewPage;

