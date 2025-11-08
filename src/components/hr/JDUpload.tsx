import { FileText, Trash2, Upload } from 'lucide-react';
import React, { useState } from 'react';
import { useHR } from '../../context/HRContext';

const JDUpload: React.FC = () => {
  const { jobDescriptions, addJobDescription, deleteJobDescription, updateJobDescription } = useHR();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    skills: '',
    department: '',
    experience: '',
    location: '',
    description: ''
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newJD = {
      title: formData.title,
      skills: formData.skills,
      department: formData.department || undefined,
      experience: formData.experience || undefined,
      location: formData.location || undefined,
      description: formData.description || undefined,
      postedOn: new Date().toISOString().split('T')[0]
    };
    if (editingId) {
      updateJobDescription(editingId, newJD);
    } else {
      addJobDescription(newJD);
    }
    setFormData({
      title: '',
      skills: ''
    });
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    deleteJobDescription(id);
  };

  const handleEdit = (jd: any) => {
    setEditingId(jd.id);
    setFormData({ title: jd.title, skills: jd.skills });
    setIsModalOpen(true);
  };

  return (
    <div className="glass p-6 rounded-xl">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white">Job Descriptions</h3>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-primary flex items-center gap-2"
        >
          <Upload size={16} />
          Add JD
        </button>
      </div>

      <div className="space-y-4">
        {jobDescriptions.map((jd) => (
          <div key={jd.id} className="bg-white/5 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="text-primary" size={20} />
                <div>
                  <h4 className="text-white font-medium">{jd.title}</h4>
                  <p className="text-sm text-muted-foreground">Skills: {jd.skills}</p>
                  {jd.department && <p className="text-sm text-muted-foreground">Dept: {jd.department}</p>}
                  {jd.experience && <p className="text-sm text-muted-foreground">Experience: {jd.experience}</p>}
                  {jd.location && <p className="text-sm text-muted-foreground">Location: {jd.location}</p>}
                  {jd.description && <p className="text-sm text-muted-foreground truncate">{jd.description}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">
                  Posted: {jd.postedOn}
                </span>
                <button onClick={() => handleEdit(jd)} className="text-white/80 hover:text-white">
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(jd.id)}
                  className="text-red-400 hover:text-red-300 ml-2"
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
            <h3 className="text-xl font-bold text-white mb-4">Add Job Description</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Job Title"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="input-field"
                required
              />
                  <input
                    type="text"
                    placeholder="Department"
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="Experience (e.g., 2-4 years)"
                    value={formData.experience}
                    onChange={(e) => setFormData({...formData, experience: e.target.value})}
                    className="input-field"
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    className="input-field"
                  />
              <input
                type="text"
                placeholder="Required Skills"
                value={formData.skills}
                onChange={(e) => setFormData({...formData, skills: e.target.value})}
                className="input-field"
                required
              />
                  <textarea
                    placeholder="Description / responsibilities"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="input-field h-28"
                  />
              <div className="flex gap-2">
                <button type="submit" className="btn-primary flex-1">Add JD</button>
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

export default JDUpload;