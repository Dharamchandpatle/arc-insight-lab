import gsap from 'gsap';
import React, { useState } from 'react';
import { useCompany } from '../../contexts/CompanyContext';

const CompanySettings: React.FC = () => {
  const { data, setData } = useCompany();
  const [form, setForm] = useState({ companyName: data.profile.companyName, head: data.profile.head, employees: data.profile.employees });

  const save = () => {
    setData(prev => ({ ...prev, profile: { companyName: form.companyName, head: form.head, employees: Number(form.employees) } }));
    // small success pulse
    gsap.fromTo('.settings-save', { scale: 0.98 }, { scale: 1, duration: 0.2 });
  };

  return (
    <div className="glass p-6 rounded-xl">
      <h3 className="text-xl font-bold text-white mb-4">Company Settings</h3>
      <div className="space-y-3 max-w-md">
        <input value={form.companyName} onChange={(e) => setForm({...form, companyName: e.target.value})} className="input-field" />
        <input value={form.head} onChange={(e) => setForm({...form, head: e.target.value})} className="input-field" />
        <input type="number" value={form.employees} onChange={(e) => setForm({...form, employees: Number(e.target.value)})} className="input-field" />
        <div className="flex gap-2 mt-3">
          <button onClick={save} className="btn-primary settings-save">Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default CompanySettings;
