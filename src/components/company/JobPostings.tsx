import React, { useState } from 'react';
import { useCompany } from '../../contexts/CompanyContext';

const JobPostings: React.FC = () => {
  const { data, addJob, updateJob, deleteJob } = useCompany();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: '', applicants: 0, status: 'Open' });

  const handleAdd = () => {
    addJob(form);
    setForm({ title: '', applicants: 0, status: 'Open' });
    setOpen(false);
  };

  return (
    <div className="glass p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-white">Job Postings</h3>
        <button onClick={() => setOpen(true)} className="btn-primary">Add New Job</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.jobPostings.map(j => (
          <div key={j.id} className="bg-white/5 p-4 rounded">
            <div className="text-white font-medium">{j.title}</div>
            <div className="text-sm text-white/60">Applicants: {j.applicants}</div>
            <div className="mt-2">
              <span className={`px-2 py-1 rounded text-xs ${j.status === 'Open' ? 'bg-green-600/20 text-green-300' : j.status === 'Screening' ? 'bg-yellow-600/20 text-yellow-300' : 'bg-red-600/20 text-red-300'}`}>{j.status}</span>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={() => updateJob(j.id, { status: j.status === 'Open' ? 'Screening' : 'Closed' })} className="btn-ghost">Toggle Status</button>
              <button onClick={() => deleteJob(j.id)} className="text-red-400">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass p-6 rounded-xl w-full max-w-md">
            <h4 className="text-white font-semibold mb-3">Add Job</h4>
            <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="input-field w-full mb-2" placeholder="Job title" />
            <input type="number" value={form.applicants} onChange={(e) => setForm({...form, applicants: Number(e.target.value)})} className="input-field w-full mb-2" placeholder="Applicants" />
            <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} className="input-field w-full mb-4">
              <option>Open</option>
              <option>Screening</option>
              <option>Closed</option>
            </select>
            <div className="flex gap-2">
              <button onClick={handleAdd} className="btn-primary flex-1">Add</button>
              <button onClick={() => setOpen(false)} className="btn-secondary flex-1">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobPostings;
