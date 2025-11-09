import React, { useEffect, useRef } from 'react';

interface VideoFeedProps {
  onStream?: (stream: MediaStream) => void;
}

export const VideoFeed: React.FC<VideoFeedProps> = ({ onStream }) => {
  const userVideo = useRef<HTMLVideoElement | null>(null);
  const hrVideo = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let mounted = true;
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      if (!mounted) return;
      if (userVideo.current) userVideo.current.srcObject = stream;
      if (hrVideo.current) hrVideo.current.srcObject = stream; // mirror for demo
      onStream?.(stream);
    }).catch((e) => {
      console.warn('Media error', e);
    });

    return () => { mounted = false; };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="relative rounded-xl overflow-hidden bg-[#021026]/40 p-1">
        <video ref={userVideo} autoPlay playsInline muted className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg" />
        <div className="absolute left-3 top-3 px-2 py-1 bg-[#00000066] text-sm rounded text-white">Candidate</div>
      </div>

      <div className="relative rounded-xl overflow-hidden bg-[#021026]/40 p-1">
        <video ref={hrVideo} autoPlay playsInline muted className="w-full h-64 md:h-96 object-cover rounded-lg shadow-lg" />
        <div className="absolute left-3 top-3 px-2 py-1 bg-[#00000066] text-sm rounded text-white">HR (mock)</div>
      </div>
    </div>
  );
};

export default VideoFeed;
