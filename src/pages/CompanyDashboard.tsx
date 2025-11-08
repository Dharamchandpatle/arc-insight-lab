import React from 'react';
import AIGlobalInsights from '../components/company/AIGlobalInsights';
import CompanySettings from '../components/company/CompanySettings';
import CompanySidebar from '../components/company/CompanySidebar';
import DepartmentPerformance from '../components/company/DepartmentPerformance';
import HRList from '../components/company/HRList';
import InterviewAnalytics from '../components/company/InterviewAnalytics';
import JobPostings from '../components/company/JobPostings';
import NotificationsPanel from '../components/company/NotificationsPanel';
import SummaryCards from '../components/company/SummaryCards';
import VideoOverview from '../components/company/VideoOverview';

const CompanyDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A0E2A] to-[#000000] text-white">
      <div className="flex">
        <CompanySidebar />
        <main className="flex-1 p-6 space-y-6">
          <SummaryCards />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <HRList />
            </div>
            <div>
              <NotificationsPanel />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <JobPostings />
            </div>
            <div>
              <AIGlobalInsights />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <DepartmentPerformance />
            <InterviewAnalytics />
          </div>

          <VideoOverview />

          <CompanySettings />
        </main>
      </div>
    </div>
  );
};

export default CompanyDashboard;
