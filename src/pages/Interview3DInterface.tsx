import React, { useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';
import ThreeDCharacter from '../components/ThreeDCharacter';
import { createMicrophoneAnalyser, getAmplitudeFromAnalyser } from '../lib/audioUtils';
import { interviewData } from '../data/interviewMockData';

const AVATAR_A = 'https://models.readyplayer.me/65aa3b20fdc23a001ce73f8d.glb';
const AVATAR_B = 'https://models.readyplayer.me/65aa3b20fdc23a001ce73f8f.glb';

export default function Interview3DInterface() {
  const [interviewerSpeaking, setInterviewerSpeaking] = useState(false);
  const [candidateSpeaking, setCandidateSpeaking] = useState(false);
  const [candidateMouth, setCandidateMouth] = useState(0);
  const [interviewerMouth, setInterviewerMouth] = useState(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // auto greet
    const t = setTimeout(() => speakInterviewer('Welcome to the 3D AI Interview demo. Are you ready?'), 1200);
    return () => clearTimeout(t);
  }, []);

  const startAudio = async () => {
    if (analyserRef.current) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioCtx();
      audioCtxRef.current = audioCtx;
      const { stream, analyser } = await createMicrophoneAnalyser(audioCtx);
      analyserRef.current = analyser;
      streamRef.current = stream;

      const loop = () => {
        if (!analyserRef.current) return;
        const amp = getAmplitudeFromAnalyser(analyserRef.current);
        // map RMS (0..1) to mouthLevel 0..1
        setCandidateMouth(amp);
        rafRef.current = requestAnimationFrame(loop);
      };
      loop();
    } catch (e) {
      console.warn('Microphone access error', e);
    }
  };

  const stopAudio = () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(()=>{});
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
    setCandidateMouth(0);
  };

  const speakInterviewer = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    // pick a voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length) u.voice = voices[0];
    u.onstart = () => {
      setInterviewerSpeaking(true);
      // animate interviewer mouth via gsap pulse
      gsap.to({}, { duration: 0.1, repeat: -1, onRepeat: () => setInterviewerMouth(v => (v > 0.6 ? 0 : 0.8)) });
    };
    u.onend = () => {
      setInterviewerSpeaking(false);
      setInterviewerMouth(0);
      gsap.killTweensOf({});
    };
    window.speechSynthesis.speak(u);
  };

  // start listening via SpeechRecognition and show mouth animation (candidate)
  const startListening = () => {
    startAudio();
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('SpeechRecognition not supported in this browser');
      return;
    }
    const r = new SpeechRecognition();
    r.continuous = false;
    r.interimResults = false;
    r.lang = 'en-US';
    r.onstart = () => setCandidateSpeaking(true);
    r.onend = () => setCandidateSpeaking(false);
    r.onresult = (ev: any) => {
      const text = ev.results[0][0].transcript;
      console.log('Candidate said:', text);
      // interviewer replies after small delay
      setTimeout(() => speakInterviewer('Interesting — can you expand on that point?'), 800);
    };
    r.onerror = (e: any) => console.warn('Recognition error', e);
    try { r.start(); } catch (e) { console.warn(e); }
  };

  useEffect(() => {
    return () => stopAudio();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0E2A] to-black text-white py-6">
      <div className="container mx-auto px-6">
        <h1 className="text-3xl font-orbitron text-[#00BFFF] mb-6">3D Interview Simulation</h1>

        <div className="w-full h-[70vh] bg-transparent rounded-lg overflow-hidden">
          <Canvas camera={{ position: [0, 1.6, 4] }} shadows>
            <ambientLight intensity={0.5} color={new THREE.Color('#0a2b3a')} />
            <directionalLight position={[2, 5, 2]} intensity={1} color={'#00BFFF'} />

            <group position={[-1.5, -1.2, 0]}>
              <ThreeDCharacter url={AVATAR_A} mouthLevel={interviewerMouth} isSpeaking={interviewerSpeaking} scale={1.2} />
            </group>

            <group position={[1.5, -1.2, 0]}>
              <ThreeDCharacter url={AVATAR_B} mouthLevel={candidateMouth} isSpeaking={candidateSpeaking} scale={1.2} />
            </group>

            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]}>
              <planeGeometry args={[10, 10]} />
              <meshStandardMaterial color={'#071127'} />
            </mesh>
          </Canvas>
        </div>

        <div className="mt-6 flex gap-4">
          <button onClick={() => speakInterviewer('Tell me about your final year project.')} className="px-6 py-3 bg-[#00BFFF]/30 border border-[#00BFFF] rounded-lg">Ask Question</button>
          <button onClick={startListening} className="px-6 py-3 bg-[#00BFFF]/30 border border-[#00BFFF] rounded-lg">Candidate Respond</button>
          <button onClick={() => { stopAudio(); setCandidateMouth(0); setInterviewerMouth(0); }} className="px-6 py-3 bg-rose-500 rounded-lg">Stop Audio</button>
        </div>
      </div>
    </div>
  );
}
