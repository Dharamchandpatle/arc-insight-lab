import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import { useCompany } from '../../contexts/CompanyContext';

const AIGlobalInsights: React.FC = () => {
  const { data, regenerateAI, setData } = useCompany() as any;
  const ref = useRef<HTMLDivElement | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editNote, setEditNote] = useState('');

  useEffect(() => {
    if (ref.current) gsap.from(ref.current.children, { opacity: 0, y: 30, stagger: 0.12, duration: 0.7 });
  }, [data.aiInsights.length]);

  const regenOne = (id: number) => {
    setData((prev: any) => ({
      ...prev,
      aiInsights: prev.aiInsights.map((a: any) => (a.id === id ? { ...a, value: `${Math.floor(70 + Math.random() * 30)}%` } : a)),
    }));
  };

  const startEdit = (a: any) => {
    setEditingId(a.id);
    setEditNote(a.note || '');
  };

  const saveEdit = () => {
    if (!editingId) return;
    setData((prev: any) => ({
      ...prev,
      aiInsights: prev.aiInsights.map((a: any) => (a.id === editingId ? { ...a, note: editNote } : a)),
    }));
    setEditingId(null);
  };

  return (
    <div className="p-6 bg-[#07102A]/70 backdrop-blur-lg rounded-xl border border-[#7C3AED]/20">
      <div className="flex items-center justify-between mb-4">
  <h3 className="text-xl font-orbitron font-bold text-[#7C3AED]">AI Global Insights</h3>
  <button onClick={regenerateAI} className="btn">Regenerate All</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.aiInsights.map(ai => (
          <div key={ai.id} className="p-4 rounded-lg bg-gradient-to-br from-white/3 to-transparent border border-white/5">
            <h4 className="font-semibold text-white">{ai.title}</h4>
            <p className="text-sm text-white/70">{ai.summary}</p>
            <div className="mt-2 flex gap-2">
              <button onClick={() => regenOne(ai.id)} className="btn btn-sm">Regenerate</button>
              <button onClick={() => startEdit(ai)} className="btn-ghost btn-sm">Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIGlobalInsights;
