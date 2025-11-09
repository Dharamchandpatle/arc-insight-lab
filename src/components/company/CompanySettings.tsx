import gsap from 'gsap';
import React, { useRef, useState } from 'react';
import { useCompany } from '../../contexts/CompanyContext';
import { companyData } from '../../data/companyMockData';

const CompanySettings: React.FC = () => {
  const { data, setData } = useCompany();
  const [form, setForm] = useState({ companyName: data.profile.companyName, head: data.profile.head, employees: data.profile.employees });

  const save = () => {
    setData(prev => ({ ...prev, profile: { companyName: form.companyName, head: form.head, employees: Number(form.employees) } }));
    // small success pulse
    gsap.fromTo('.settings-save', { scale: 0.98 }, { scale: 1, duration: 0.2 });
  };

  const { regenerateAI, markAllNotificationsRead } = useCompany() as any;
  const fileRef = useRef<HTMLInputElement | null>(null);

  const resetDefaults = () => {
    if (!confirm('Reset all company data to defaults? This will overwrite current state.')) return;
    setData(companyData as any);
  };

  const exportData = () => {
    const payload = JSON.stringify(data, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.profile.companyName.replace(/\s+/g, '_') || 'company_data'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (file: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(String(e.target?.result || '{}'));
        if (confirm('Importing will overwrite current company data. Continue?')) {
          setData(parsed as any);
        }
      } catch (err) {
        alert('Invalid JSON file');
      }
    };
    reader.readAsText(file);
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
        <div className="flex gap-2 mt-3">
          <button onClick={() => regenerateAI()} className="btn-ghost">Regenerate AI</button>
          <button onClick={() => markAllNotificationsRead()} className="btn-ghost">Mark Notifications Read</button>
        </div>

        <div className="flex gap-2 mt-3">
          <button onClick={exportData} className="btn-ghost">Export Data</button>
          <button onClick={() => fileRef.current?.click()} className="btn-ghost">Import Data</button>
          <input ref={fileRef} type="file" accept="application/json" onChange={(e) => importData(e.target.files?.[0] ?? null)} className="hidden" />
          <button onClick={resetDefaults} className="btn-danger">Reset Defaults</button>
        </div>
      </div>
    </div>
  );
};

export default CompanySettings;
