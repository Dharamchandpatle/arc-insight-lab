import { Mic, MicOff, Monitor, PhoneOff, Video } from 'lucide-react';
import React, { useRef, useState } from 'react';

const configuration: RTCConfiguration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };

const VideoCallSection: React.FC = () => {
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [offerSDP, setOfferSDP] = useState('');
  const [answerSDP, setAnswerSDP] = useState('');
  const [localCandidates, setLocalCandidates] = useState<string[]>([]);
  const [remoteCandidatesText, setRemoteCandidatesText] = useState('');

  const startPreview = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        await localVideoRef.current.play().catch(() => {});
      }
      setIsPreview(true);
    } catch (e) {
      console.error('getUserMedia error', e);
      alert('Unable to access camera/microphone. Check permissions.');
    }
  };

  const stopPreview = () => {
    const s = localStreamRef.current;
    if (s) {
      s.getTracks().forEach(t => t.stop());
      localStreamRef.current = null;
    }
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    setIsPreview(false);
  };

  const toggleMute = () => {
    const tracks = localStreamRef.current?.getAudioTracks() || [];
    tracks.forEach(t => (t.enabled = !t.enabled));
    setIsMuted(prev => !prev);
  };

  const toggleVideo = () => {
    const tracks = localStreamRef.current?.getVideoTracks() || [];
    tracks.forEach(t => (t.enabled = !t.enabled));
    setIsVideoOn(prev => !prev);
  };

  const createPeerConnection = () => {
    const pc = new RTCPeerConnection(configuration);
    pcRef.current = pc;

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        setLocalCandidates(prev => [...prev, JSON.stringify(event.candidate)]);
      }
    };

    pc.ontrack = (ev) => {
      if (remoteVideoRef.current) {
        // If multiple tracks, use the first stream
        remoteVideoRef.current.srcObject = ev.streams[0];
      }
    };

    // attach local tracks
    const ls = localStreamRef.current;
    if (ls) {
      ls.getTracks().forEach(track => pc.addTrack(track, ls));
    }

    return pc;
  };

  const createOffer = async () => {
    if (!localStreamRef.current) {
      await startPreview();
    }
    const pc = createPeerConnection();
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    // Wait briefly to gather some ICE candidates (trickle will continue)
    setOfferSDP(JSON.stringify(pc.localDescription));
  };

  const createAnswerFromOffer = async (offerJson: string) => {
    try {
      const offer = JSON.parse(offerJson) as RTCSessionDescriptionInit;
      if (!localStreamRef.current) {
        await startPreview();
      }
      const pc = createPeerConnection();
      await pc.setRemoteDescription(offer);
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      setAnswerSDP(JSON.stringify(pc.localDescription));
    } catch (e) {
      console.error(e);
      alert('Invalid offer SDP');
    }
  };

  const setRemoteAnswer = async (answerJson: string) => {
    try {
      const pc = pcRef.current;
      if (!pc) {
        alert('No peer connection exists. Create an offer first.');
        return;
      }
      const answer = JSON.parse(answerJson) as RTCSessionDescriptionInit;
      await pc.setRemoteDescription(answer);
    } catch (e) {
      console.error(e);
      alert('Invalid answer SDP');
    }
  };

  const addRemoteCandidates = async () => {
    try {
      const pc = pcRef.current;
      if (!pc) {
        alert('No peer connection exists');
        return;
      }
      const lines = remoteCandidatesText.split('\n').map(l => l.trim()).filter(Boolean);
      for (const l of lines) {
        const cand = JSON.parse(l) as RTCIceCandidateInit;
        await pc.addIceCandidate(cand);
      }
      alert('Added remote ICE candidates');
    } catch (e) {
      console.error(e);
      alert('Failed to add remote candidates');
    }
  };

  const endCall = () => {
    const pc = pcRef.current;
    try {
      pc?.close();
    } catch {}
    pcRef.current = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    stopPreview();
    setOfferSDP('');
    setAnswerSDP('');
    setLocalCandidates([]);
    setRemoteCandidatesText('');
  };

  return (
    <div className="glass p-6 rounded-xl">
      <h3 className="text-xl font-bold text-white mb-6">Video Interview</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-white/80 mb-2">Local Preview</div>
          <video ref={localVideoRef} className="w-full bg-black/40 rounded-lg" playsInline muted />
          <div className="flex items-center gap-2 mt-3">
            {!isPreview ? (
              <button onClick={startPreview} className="btn-primary">Start Preview</button>
            ) : (
              <button onClick={stopPreview} className="btn-secondary">Stop Preview</button>
            )}

            <button onClick={toggleMute} className={`p-2 rounded ${isMuted ? 'bg-red-600/20' : 'bg-white/10'}`}>
              {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
            </button>

            <button onClick={toggleVideo} className={`p-2 rounded ${!isVideoOn ? 'bg-red-600/20' : 'bg-white/10'}`}>
              {isVideoOn ? <Video size={16} /> : <Monitor size={16} />}
            </button>
          </div>
        </div>

        <div>
          <div className="text-sm text-white/80 mb-2">Remote</div>
          <video ref={remoteVideoRef} className="w-full bg-black/40 rounded-lg" playsInline autoPlay />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-white font-medium mb-2">Host (create offer)</h4>
          <div className="flex gap-2 mb-2">
            <button onClick={createOffer} className="btn-primary">Create Offer</button>
            <button onClick={() => { navigator.clipboard?.writeText(offerSDP); }} className="btn-ghost">Copy Offer</button>
          </div>
          <textarea value={offerSDP} readOnly rows={5} className="w-full p-2 bg-white/5 rounded text-xs" />
          <div className="mt-2">
            <div className="text-sm text-white/80 mb-1">Local ICE candidates (copy to peer)</div>
            <textarea value={localCandidates.join('\n')} readOnly rows={3} className="w-full p-2 bg-white/5 rounded text-xs" />
          </div>
        </div>

        <div>
          <h4 className="text-white font-medium mb-2">Guest (paste offer / create answer)</h4>
          <div className="flex gap-2 mb-2">
            <button onClick={() => {
              const s = prompt('Paste Offer SDP here');
              if (s) createAnswerFromOffer(s);
            }} className="btn-primary">Paste Offer & Create Answer</button>
            <button onClick={() => { navigator.clipboard?.writeText(answerSDP); }} className="btn-ghost">Copy Answer</button>
          </div>
          <textarea value={answerSDP} readOnly rows={5} className="w-full p-2 bg-white/5 rounded text-xs" />
          <div className="mt-2">
            <div className="text-sm text-white/80 mb-1">Paste remote ICE candidates (one JSON per line)</div>
            <textarea value={remoteCandidatesText} onChange={(e) => setRemoteCandidatesText(e.target.value)} rows={4} className="w-full p-2 bg-white/5 rounded text-xs" />
            <div className="flex gap-2 mt-2">
              <button onClick={addRemoteCandidates} className="btn-primary">Add Remote Candidates</button>
              <button onClick={() => { navigator.clipboard?.writeText(localCandidates.join('\n')); }} className="btn-ghost">Copy My Candidates</button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3">
        <button onClick={endCall} className="p-3 rounded-full bg-red-500/20 text-red-400 hover:bg-red-500/30">
          <PhoneOff size={18} /> End Call
        </button>
        <div className="text-sm text-white/60">Tip: For peer-to-peer, create an offer on one browser, copy the offer JSON to the other, create an answer, then paste the answer back. Also exchange ICE candidates (copy/paste) if needed.</div>
      </div>
    </div>
  );
};

export default VideoCallSection;