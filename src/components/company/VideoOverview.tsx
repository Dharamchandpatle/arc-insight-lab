import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompany } from '../../contexts/CompanyContext';

const VideoOverview: React.FC = () => {
  const { data } = useCompany();
  const navigate = useNavigate();

  return (
    <div className="glass p-6 rounded-xl">
      <h3 className="text-xl font-bold text-white mb-4">Video Overview</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[1,2,3,4].map(i => (
          <div key={i} className="video-feed bg-black/40 h-28 rounded flex items-center justify-center text-white/60">Feed {i}</div>
        ))}
      </div>
      <div className="mt-4">
        <button onClick={() => navigate('/hr/video-call')} className="btn-primary">Join Interview</button>
      </div>
    </div>
  );
};

export default VideoOverview;
