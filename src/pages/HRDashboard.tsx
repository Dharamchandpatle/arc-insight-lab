import { Menu } from 'lucide-react';
import React, { useState } from 'react';
import CandidateCard from '../components/hr/CandidateCard';
import HRSidebar from '../components/hr/HRSidebar';
import StatsCard from '../components/hr/StatsCard';
import { Button } from '../components/ui/button';
import { useHR } from '../contexts/HRContext';

const HRDashboard: React.FC = () => {
  const { data } = useHR();
  const [collapsed, setCollapsed] = useState(false);

  const sidebarWidthClass = collapsed ? 'ml-16' : 'ml-64';

  return (
    <div className="relative min-h-screen bg-transparent">
      <HRSidebar collapsed={collapsed} />

      <main className={`${sidebarWidthClass} transition-margin duration-300 p-6`}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">HR Dashboard</h1>
          <Button size="sm" variant="ghost" onClick={() => setCollapsed(s => !s)}>
            <Menu className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <StatsCard
            title="Top Performing Candidate"
            value={data.analytics.topCandidate}
          />
          <StatsCard
            title="Average JD Match"
            value={`${data.analytics.avgJDMatch}%`}
            description="Based on skill matching"
          />
          <StatsCard
            title="Feedback Reports"
            value={data.analytics.feedbackReports}
            description="Reports generated this month"
          />
        </div>

        <h2 className="text-2xl font-semibold mb-4">Upcoming Interviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.upcomingInterviews.map((interview) => (
            <CandidateCard
              key={interview.id}
              candidate={interview.candidate}
              role={interview.role}
              date={interview.date}
              time={interview.time}
              status={interview.status}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default HRDashboard;
