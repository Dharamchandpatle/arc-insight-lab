import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AIGlobalInsights from "./components/company/AIGlobalInsights";
import CompanyLayout from "./components/company/CompanyLayout";
import CompanyNavbar from "./components/company/CompanyNavbar.tsx";
import CompanySettings from "./components/company/CompanySettings";
import DepartmentPerformance from "./components/company/DepartmentPerformance";
import HRList from "./components/company/HRList";
import InterviewAnalytics from "./components/company/InterviewAnalytics";
import JobPostings from "./components/company/JobPostings";
import AIFeedbackPanel from "./components/hr/AIFeedbackPanel";
import AnalyticsCharts from "./components/hr/AnalyticsCharts";
import HRLayout from "./components/hr/HRLayout";
import InterviewSchedule from "./components/hr/InterviewSchedule";
import JDUpload from "./components/hr/JDUpload";
import NotificationPanel from "./components/hr/NotificationPanel";
import VideoCallSection from "./components/hr/VideoCallSection";
import FooterLegacy from "./components/layout/FooterLegacy";
import { CandidateProvider } from "./context/CandidateContext";
import { AuthProvider } from "./contexts/AuthContext";
import { CompanyProvider } from "./contexts/CompanyContext";
import { HRProvider } from "./contexts/HRContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import CandidateDashboard from "./pages/CandidateDashboard";
import CompanyDashboard from "./pages/CompanyDashboard";
import HRDashboard from "./pages/HRDashboard";
import HRLogin from "./pages/HRLogin";
import InterviewPage from "./pages/InterviewPage";
import Interview3DInterface from "./pages/Interview3DInterface";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const PracticePage = lazy(() => import("./pages/PracticePage"));

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          <CandidateProvider>
          <CompanyProvider>
          <HRProvider>
          {/* Global Company header (single header) */}
          <CompanyNavbar />

          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
            <Route path="/hr/login" element={<HRLogin />} />

            {/* HR area uses a layout so sidebar stays visible for all HR pages */}
            <Route path="/hr" element={<HRLayout />}>
              <Route index element={<HRDashboard />} />
              <Route path="dashboard" element={<HRDashboard />} />
              <Route path="jd-upload" element={<JDUpload />} />
              <Route path="interview-schedule" element={<InterviewSchedule />} />
              <Route path="analytics" element={<AnalyticsCharts />} />
              <Route path="ai-feedback" element={<AIFeedbackPanel />} />
              <Route path="video-call" element={<VideoCallSection />} />
              <Route path="notifications" element={<NotificationPanel />} />
            </Route>

            <Route path="/practice" element={<Suspense fallback={<div className='p-6'>Loading practice...</div>}><PracticePage /></Suspense>} />
            <Route path="/company" element={<CompanyLayout />}>
              <Route index element={<CompanyDashboard />} />
              <Route path="hr-list" element={<HRList />} />
              <Route path="job-postings" element={<JobPostings />} />
              <Route path="departments" element={<DepartmentPerformance />} />
              <Route path="analytics" element={<InterviewAnalytics />} />
              <Route path="ai-insights" element={<AIGlobalInsights />} />
              <Route path="settings" element={<CompanySettings />} />
            </Route>
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/interview3d" element={<Interview3DInterface />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* Legacy footer rendered globally. To use the new footer, replace with <Footer /> */}
          <FooterLegacy />
          </HRProvider>
          </CompanyProvider>
          </CandidateProvider>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
