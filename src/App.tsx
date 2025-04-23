
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/lib/auth";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import DashboardPage from "./pages/dashboard";
import AllDocumentsPage from "./pages/dashboard/all-documents";
import UploadPage from "./pages/dashboard/upload";
import AddDocumentTypePage from "./pages/dashboard/document-types";
import ReviewPage from "./pages/dashboard/review";
import SettingsPage from "./pages/dashboard/settings";
import AiModelsPage from "./pages/dashboard/ai-models";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Navigate to="/auth/login" replace />} />
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/dashboard/all-documents" element={<AllDocumentsPage />} />
            <Route path="/dashboard/upload" element={<UploadPage />} />
            <Route path="/dashboard/document-types" element={<AddDocumentTypePage />} />
            <Route path="/dashboard/review/:id" element={<ReviewPage />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
            <Route path="/dashboard/ai-models" element={<AiModelsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
