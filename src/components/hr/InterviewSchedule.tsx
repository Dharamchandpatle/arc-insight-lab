import { Calendar, Clock, Plus, Trash2, User } from 'lucide-react';
import React, { useState } from 'react';
import { useHR } from '../../context/HRContext';

const InterviewSchedule: React.FC = () => {
  const { scheduledInterviews, addInterview, updateInterviewStatus, removeInterview } = useHR();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    candidate: '',
    role: '',
    date: '',
    time: '',
    status: 'scheduled'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addInterview(formData);
    setFormData({
      candidate: '',
      role: '',
      date: '',
      time: '',
      status: 'scheduled'
    });
    setIsModalOpen(false);
  };

  const handleStatusChange = (id: number, status: string) => {
    updateInterviewStatus(id, status);
  };

  const handleDelete = (id: number) => {
    const okay = window.confirm('Delete this interview? This action cannot be undone.');
    if (!okay) return;
    const success = removeInterview(id);
    if (!success) {
      // fallback: log
      console.warn('Failed to delete interview', id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500/20 text-green-400';
      case 'cancelled': return 'bg-red-500/20 text-red-400';
      default: return 'bg-blue-500/20 text-blue-400';
    }
  };

  return (
    <div className="glass p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Interview Schedule</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={16} />
          Schedule Interview
        </button>
      </div>

      <div className="space-y-4">
        {scheduledInterviews.map((interview) => (
          <div key={interview.id} className="bg-white/5 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="text-primary" size={20} />
                <div>
                  <h4 className="text-white font-medium">{interview.candidate}</h4>
                  <p className="text-sm text-muted-foreground">{interview.role}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar size={14} />
                    {interview.date}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock size={14} />
                    {interview.time}
                  </div>
                </div>
                <select
                  value={interview.status}
                  onChange={(e) => handleStatusChange(interview.id, e.target.value)}
                  className="bg-transparent border border-white/20 rounded px-2 py-1 text-sm text-white"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(interview.status)}`}>
                  {interview.status}
                </span>
                <button
                  onClick={() => handleDelete(interview.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass p-6 rounded-xl w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Schedule Interview</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Candidate Name"
                value={formData.candidate}
                onChange={(e) => setFormData({...formData, candidate: e.target.value})}
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="Role/Position"
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="input-field"
                required
              />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className="input-field"
                required
              />
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                className="input-field"
                required
              />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">Schedule</button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewSchedule;