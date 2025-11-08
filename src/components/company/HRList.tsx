import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import { useCompany } from '../../contexts/CompanyContext';

const HRList: React.FC = () => {
  const { data, toggleHRActive } = useCompany();
  const [selected, setSelected] = useState<number | null>(null);
  const rowsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (rowsRef.current) gsap.from(rowsRef.current.children, { opacity: 0, y: 10, stagger: 0.06 });
  }, [data.hrList.length]);

  return (
    <div className="glass p-6 rounded-xl">
      <h3 className="text-xl font-bold text-white mb-4">HR Team</h3>
      <div ref={rowsRef} className="space-y-2">
        {data.hrList.map(h => (
          <div key={h.id} className="flex items-center justify-between p-3 bg-white/5 rounded">
            <div>
              <div className="text-white font-medium">{h.name}</div>
              <div className="text-xs text-white/60">{h.role}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-white/60">Interviews: {h.interviewsToday}</div>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={h.active} onChange={() => toggleHRActive(h.id)} />
                <span className="text-xs text-white/60">{h.active ? 'Active' : 'Inactive'}</span>
              </label>
              <button onClick={() => setSelected(h.id)} className="btn-ghost">View Performance</button>
            </div>
          </div>
        ))}
      </div>

      {selected && (
        <div className="mt-4 bg-white/3 p-4 rounded">
          <h4 className="text-white font-semibold">Performance - {data.hrList.find(x => x.id === selected)?.name}</h4>
          <p className="text-white/60 text-sm">Simple mock performance metrics available here.</p>
          <button onClick={() => setSelected(null)} className="btn-secondary mt-3">Close</button>
        </div>
      )}
    </div>
  );
};

export default HRList;
