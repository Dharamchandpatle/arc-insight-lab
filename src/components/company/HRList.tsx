import gsap from 'gsap';
import React, { useEffect, useRef, useState } from 'react';
import { useCompany } from '../../contexts/CompanyContext';

const HRList: React.FC = () => {
  const { data, toggleHRActive, addHR, updateHR, deleteHR } = useCompany();
  const [selected, setSelected] = useState<number | null>(null);
  const [editing, setEditing] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', role: '' });
  const rowsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (rowsRef.current) gsap.from(rowsRef.current.children, { opacity: 0, y: 10, stagger: 0.06 });
  }, [data.hrList.length]);

  const startEdit = (h: any) => {
    setEditing(h.id);
    setForm({ name: h.name, role: h.role });
  };

  const submitEdit = () => {
    if (editing) {
      updateHR(editing, { name: form.name, role: form.role });
      setEditing(null);
    }
  };

  const submitAdd = () => {
    if (form.name.trim()) {
      addHR({ name: form.name.trim(), role: form.role.trim() || 'HR' });
      setForm({ name: '', role: '' });
      setShowAdd(false);
    }
  };

  return (
    <div className="p-6 bg-[#0A0E2A]/70 backdrop-blur-lg rounded-xl border border-[#00BFFF]/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-orbitron font-bold text-[#00BFFF]">HR Team</h3>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowAdd(s => !s)} className="btn-secondary">{showAdd ? 'Cancel' : 'Add HR'}</button>
        </div>
      </div>

      {showAdd && (
        <div className="mb-4 p-3 bg-white/3 rounded">
          <input className="w-full mb-2 input-field" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <input className="w-full mb-2 input-field" placeholder="Role" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
          <div className="flex gap-2">
            <button onClick={submitAdd} className="btn-primary">Add</button>
            <button onClick={() => { setShowAdd(false); setForm({ name: '', role: '' }); }} className="btn-ghost">Cancel</button>
          </div>
        </div>
      )}

      <div ref={rowsRef} className="space-y-2">
        {data.hrList.map(h => (
          <div key={h.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
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
              <button onClick={() => setSelected(h.id)} className="btn-ghost">View</button>
              <button onClick={() => startEdit(h)} className="btn-ghost">Edit</button>
              <button onClick={() => { if (confirm('Delete this HR?')) deleteHR(h.id); }} className="btn-danger">Delete</button>
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

      {editing && (
        <div className="mt-4 bg-white/3 p-4 rounded">
          <h4 className="text-white font-semibold">Edit HR</h4>
          <input className="w-full mb-2 input-field" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <input className="w-full mb-2 input-field" placeholder="Role" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} />
          <div className="flex gap-2">
            <button onClick={submitEdit} className="btn-primary">Save</button>
            <button onClick={() => setEditing(null)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HRList;
