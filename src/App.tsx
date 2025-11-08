import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import FooterLegacy from "./components/layout/FooterLegacy";
import NavbarLegacy from "./components/layout/NavbarLegacy";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Analytics from "./pages/Analytics";
import CandidateDashboard from "./pages/CandidateDashboard";
import HRDashboard from "./pages/HRDashboard";
import InterviewPage from "./pages/InterviewPage";
import InterviewScheduling from "./pages/InterviewScheduling";
import JDUpload from "./pages/JDUpload";
import Landing from "./pages/Landing";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
          {/* Legacy/global header - you can swap to the new Navbar by replacing this import */}
          <NavbarLegacy showSearch />

          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/hr-dashboard" element={<HRDashboard />} />
            <Route path="/jd-upload" element={<JDUpload />} />
            <Route path="/interview-scheduling" element={<InterviewScheduling />} />
            <Route path="/candidate-dashboard" element={<CandidateDashboard />} />
            <Route path="/interview" element={<InterviewPage />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          {/* Legacy footer rendered globally. To use the new footer, replace with <Footer /> */}
          <FooterLegacy />
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
