import React from 'react';
import AIGlobalInsights from '../components/company/AIGlobalInsights';
import CompanySettings from '../components/company/CompanySettings';
import DepartmentPerformance from '../components/company/DepartmentPerformance';
import HRList from '../components/company/HRList';
import InterviewAnalytics from '../components/company/InterviewAnalytics';
import JobPostings from '../components/company/JobPostings';
import NotificationsPanel from '../components/company/NotificationsPanel';
import SummaryCards from '../components/company/SummaryCards';
import VideoOverview from '../components/company/VideoOverview';

const CompanyDashboard: React.FC = () => {
  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold font-orbitron mb-2 bg-gradient-to-r from-[#00BFFF] to-[#1E90FF] bg-clip-text text-transparent">AI-NEXUS</h2>
        <p className="text-gray-400 text-lg">Company Dashboard</p>
      </div>

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
    </>
  );
};

export default CompanyDashboard;
