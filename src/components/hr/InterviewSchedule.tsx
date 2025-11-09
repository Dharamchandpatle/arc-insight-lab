import { Calendar, Clock, Plus, Trash2, User } from 'lucide-react';
import React, { useState } from 'react';
import { useHR } from '../../context/HRContext';
import { interviewsAPI } from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

const InterviewSchedule: React.FC = () => {
  const { scheduledInterviews, addNewInterview, updateExistingInterview, removeInterview } = useHR();
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    candidateEmail: '',
    candidateName: '',
    role: '',
    date: '',
    time: '',
    jobDescription: '',
    status: 'scheduled'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error('Please login to schedule interviews');
      return;
    }

    setLoading(true);
    try {
      // Combine date and time into ISO string
      const scheduledAt = new Date(`${formData.date}T${formData.time}`).toISOString();
      
      // For now, we'll use candidateEmail to find candidate
      // In a real app, you'd have a candidate selection dropdown
      // For now, we'll create interview with candidateEmail as identifier
      const interviewData = {
        candidateId: formData.candidateEmail, // This should be candidate user ID in production
        candidateName: formData.candidateName,
        role: formData.role,
        scheduledTime: scheduledAt,
        jobDescription: formData.jobDescription,
        date: formData.date,
        time: formData.time,
      };

      // Use backend API through HRContext
      await addNewInterview(interviewData as any);
      
      toast.success('Interview scheduled successfully!');
      setFormData({
        candidateEmail: '',
        candidateName: '',
        role: '',
        date: '',
        time: '',
        jobDescription: '',
        status: 'scheduled'
      });
      setIsModalOpen(false);
    } catch (error: any) {
      console.error('Failed to schedule interview:', error);
      toast.error(error.message || 'Failed to schedule interview');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, status: string) => {
    try {
      const updated = updateExistingInterview(id, { status } as any);
      if (updated) {
        toast.success('Interview status updated');
      } else {
        toast.error('Failed to update status');
      }
    } catch (error: any) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: number) => {
    const okay = window.confirm('Delete this interview? This action cannot be undone.');
    if (!okay) return;
    
    try {
      const success = removeInterview(id);
      if (success) {
        toast.success('Interview deleted');
      } else {
        toast.error('Failed to delete interview');
      }
    } catch (error: any) {
      toast.error('Failed to delete interview');
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
        {scheduledInterviews.length === 0 && (
          <div className="text-center py-8 text-white/60">
            <p>No interviews scheduled yet</p>
            <p className="text-sm mt-2">Click "Schedule Interview" to add one</p>
          </div>
        )}
        {scheduledInterviews.map((interview) => {
          const interviewDate = interview.scheduledTime ? new Date(interview.scheduledTime) : null;
          const dateStr = interviewDate ? interviewDate.toLocaleDateString() : interview.date || 'N/A';
          const timeStr = interviewDate ? interviewDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : interview.time || 'N/A';
          
          return (
          <div key={interview.id} className="bg-white/5 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <User className="text-primary" size={20} />
                <div>
                  <h4 className="text-white font-medium">{interview.candidate || 'Unknown Candidate'}</h4>
                  <p className="text-sm text-muted-foreground">{interview.position || interview.role || 'Position'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar size={14} />
                    {dateStr}
                  </div>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock size={14} />
                    {timeStr}
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
          );
        })}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="glass p-6 rounded-xl w-full max-w-md">
            <h3 className="text-xl font-bold text-white mb-4">Schedule Interview</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Candidate Email"
                value={formData.candidateEmail}
                onChange={(e) => setFormData({...formData, candidateEmail: e.target.value})}
                className="input-field"
                required
              />
              <input
                type="text"
                placeholder="Candidate Name"
                value={formData.candidateName}
                onChange={(e) => setFormData({...formData, candidateName: e.target.value})}
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
              <textarea
                placeholder="Job Description (required)"
                value={formData.jobDescription}
                onChange={(e) => setFormData({...formData, jobDescription: e.target.value})}
                className="input-field h-24"
                required
              />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1" disabled={loading}>
                  {loading ? 'Scheduling...' : 'Schedule'}
                </button>
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