
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
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

const App = () => {
  const [authInitialized, setAuthInitialized] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Setup auth listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setSession(session);
        setAuthInitialized(true);
      }
    );

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setAuthInitialized(true);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  if (!authInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to={session ? "/dashboard" : "/auth/login"} replace />} />
            <Route path="/auth/login" element={session ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
            <Route path="/auth/register" element={session ? <Navigate to="/dashboard" replace /> : <RegisterPage />} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={session ? <DashboardPage /> : <Navigate to="/auth/login" replace />} />
            <Route path="/dashboard/all-documents" element={session ? <AllDocumentsPage /> : <Navigate to="/auth/login" replace />} />
            <Route path="/dashboard/upload" element={session ? <UploadPage /> : <Navigate to="/auth/login" replace />} />
            <Route path="/dashboard/document-types" element={session ? <AddDocumentTypePage /> : <Navigate to="/auth/login" replace />} />
            <Route path="/dashboard/review/:id" element={session ? <ReviewPage /> : <Navigate to="/auth/login" replace />} />
            <Route path="/dashboard/settings" element={session ? <SettingsPage /> : <Navigate to="/auth/login" replace />} />
            <Route path="/dashboard/ai-models" element={session ? <AiModelsPage /> : <Navigate to="/auth/login" replace />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
