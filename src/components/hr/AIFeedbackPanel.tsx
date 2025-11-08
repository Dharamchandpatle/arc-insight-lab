import { AlertTriangle, Brain, Lightbulb } from 'lucide-react';
import React, { useState } from 'react';
import { useHR } from '../../contexts/HRContext';

const AIFeedbackPanel: React.FC = () => {
  const { aiFeedbacks, addAIFeedback, updateAIFeedback, deleteAIFeedback } = useHR();
  const [open, setOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [form, setForm] = useState({ candidate: '', feedback: '', improvement: '' });

  const openNew = () => {
    setEditingIndex(null);
    setForm({ candidate: '', feedback: '', improvement: '' });
    setOpen(true);
  };

  const openEdit = (i: number) => {
    const fb = aiFeedbacks[i];
    setEditingIndex(i);
    setForm({ candidate: fb.candidate, feedback: fb.feedback, improvement: fb.improvement });
    setOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIndex === null) {
      addAIFeedback(form);
    } else {
      updateAIFeedback(editingIndex, form);
    }
    setOpen(false);
  };

  const handleDelete = (i: number) => {
    if (!window.confirm('Delete this AI feedback?')) return;
    deleteAIFeedback(i);
  };

  return (
    <div className="glass p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">AI Feedback & Insights</h3>
        <button onClick={openNew} className="btn-primary">Add Feedback</button>
      </div>

      <div className="space-y-4">
        {aiFeedbacks.map((feedback, index) => (
          <div key={index} className="bg-white/5 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Brain className="text-primary mt-1" size={20} />
              <div className="flex-1">
                <h4 className="text-white font-medium mb-2">{feedback.candidate}</h4>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="text-green-400 mt-0.5" size={16} />
                    <div>
                      <p className="text-sm text-white/80 font-medium">Feedback</p>
                      <p className="text-sm text-white/60">{feedback.feedback}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="text-yellow-400 mt-0.5" size={16} />
                    <div>
                      <p className="text-sm text-white/80 font-medium">Areas for Improvement</p>
                      <p className="text-sm text-white/60">{feedback.improvement}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(index)} className="btn-ghost">Edit</button>
                <button onClick={() => handleDelete(index)} className="text-red-400">Delete</button>
              </div>
            </div>
          </div>
        ))}

        {aiFeedbacks.length === 0 && (
          <div className="text-center py-8">
            <Brain className="text-primary mx-auto mb-4" size={48} />
            <p className="text-white/60">No AI feedback available yet</p>
            <p className="text-white/40 text-sm">Feedback will appear after interviews are conducted</p>
          </div>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass p-6 rounded-xl w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">{editingIndex === null ? 'Add' : 'Edit'} AI Feedback</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                value={form.candidate}
                onChange={(e) => setForm({...form, candidate: e.target.value})}
                placeholder="Candidate name"
                className="input-field"
                required
              />
              <textarea
                value={form.feedback}
                onChange={(e) => setForm({...form, feedback: e.target.value})}
                placeholder="Feedback summary"
                className="input-field h-24"
                required
              />
              <input
                value={form.improvement}
                onChange={(e) => setForm({...form, improvement: e.target.value})}
                placeholder="Improvement suggestions (optional)"
                className="input-field"
              />

              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">{editingIndex === null ? 'Add' : 'Save'}</button>
                <button type="button" onClick={() => setOpen(false)} className="btn-secondary flex-1">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIFeedbackPanel;