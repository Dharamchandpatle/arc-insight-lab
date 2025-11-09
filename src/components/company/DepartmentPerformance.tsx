import React, { useMemo, useState } from 'react';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { useCompany } from '../../contexts/CompanyContext';

const DepartmentPerformance: React.FC = () => {
  const { data, addDepartment, updateDepartment, deleteDepartment } = useCompany();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', totalPositions: 0, filled: 0 });
  const [showAdd, setShowAdd] = useState(false);

  const chartData = useMemo(() => data.departments.map((d: any) => ({ name: d.name, total: d.totalPositions, filled: d.filled })), [data.departments]);

  const startEdit = (d: any) => {
    setEditingId((d as any).id);
    setForm({ name: d.name, totalPositions: d.totalPositions, filled: d.filled });
  };

  const submitEdit = () => {
    if (!editingId) return;
    updateDepartment(editingId, { name: form.name, totalPositions: form.totalPositions, filled: form.filled });
    setEditingId(null);
    setForm({ name: '', totalPositions: 0, filled: 0 });
  };

  const submitAdd = () => {
    if (!form.name.trim()) return;
    addDepartment({ name: form.name.trim(), totalPositions: Number(form.totalPositions) });
    setShowAdd(false);
    setForm({ name: '', totalPositions: 0, filled: 0 });
  };

  return (
    <div className="glass p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Department Performance</h3>
        <div>
          <button onClick={() => setShowAdd(s => !s)} className="btn-secondary">{showAdd ? 'Cancel' : 'Add Department'}</button>
        </div>
      </div>

      {showAdd && (
        <div className="mb-4 p-3 bg-white/3 rounded">
          <input className="w-full mb-2 input-field" placeholder="Department name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <input className="w-full mb-2 input-field" type="number" placeholder="Total positions" value={form.totalPositions} onChange={e => setForm(f => ({ ...f, totalPositions: Number(e.target.value) }))} />
          <div className="flex gap-2">
            <button onClick={submitAdd} className="btn-primary">Add</button>
            <button onClick={() => { setShowAdd(false); setForm({ name: '', totalPositions: 0, filled: 0 }); }} className="btn-ghost">Cancel</button>
          </div>
        </div>
      )}

      <div style={{ height: 240 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip />
            <Bar dataKey="total" fill="#0ea5e9" />
            <Bar dataKey="filled" fill="#06b6d4">
              {chartData.map((entry, idx) => (
                <Cell key={idx} fill={entry.filled / Math.max(1, entry.total) > 0.8 ? '#10b981' : '#f59e0b'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-2">
        {data.departments.map((d: any) => (
          <div key={(d as any).id} className="flex items-center justify-between p-3 bg-white/5 rounded">
            <div>
              <div className="text-white font-medium">{d.name}</div>
              <div className="text-xs text-white/60">Filled: {d.filled} / {d.totalPositions}</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => startEdit(d)} className="btn-ghost">Edit</button>
              <button onClick={() => { if (confirm('Delete department?')) deleteDepartment((d as any).id); }} className="btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editingId && (
        <div className="mt-4 bg-white/3 p-4 rounded">
          <h4 className="text-white font-semibold">Edit Department</h4>
          <input className="w-full mb-2 input-field" placeholder="Name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <input className="w-full mb-2 input-field" type="number" placeholder="Total positions" value={form.totalPositions} onChange={e => setForm(f => ({ ...f, totalPositions: Number(e.target.value) }))} />
          <input className="w-full mb-2 input-field" type="number" placeholder="Filled" value={form.filled} onChange={e => setForm(f => ({ ...f, filled: Number(e.target.value) }))} />
          <div className="flex gap-2">
            <button onClick={submitEdit} className="btn-primary">Save</button>
            <button onClick={() => setEditingId(null)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentPerformance;
