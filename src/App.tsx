import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import BlockProfile from "./pages/BlockProfile";
import Agenda from "./pages/Agenda";
import News from "./pages/News";
import NotFound from "./pages/NotFound";
import Login from './pages/Login'
import Register from './pages/Register'
import AdminDashboard from './pages/Admin/Dashboard'
import AdminBlocks from './pages/Admin/BlocksManager'
import AdminEvents from './pages/Admin/EventsManager'
import BlockForm from './pages/Admin/BlockForm'
import EventForm from './pages/Admin/EventForm'
import ErrorBoundary from './components/ErrorBoundary'
import { AuthProvider, useAuth } from './auth/AuthProvider'
import { Navigate } from 'react-router-dom'

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/bloco/:id" element={<BlockProfile />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/noticias" element={<News />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected admin routes */}
          <Route path="/admin" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
          <Route path="/admin/blocks" element={<RequireAuth><ErrorBoundary><AdminBlocks /></ErrorBoundary></RequireAuth>} />
          <Route path="/admin/blocks/new" element={<RequireAuth><ErrorBoundary><BlockForm /></ErrorBoundary></RequireAuth>} />
          <Route path="/admin/blocks/:id/edit" element={<RequireAuth><ErrorBoundary><BlockForm /></ErrorBoundary></RequireAuth>} />

          <Route path="/admin/events" element={<RequireAuth><AdminEvents /></RequireAuth>} />
          <Route path="/admin/events/new" element={<RequireAuth><EventForm /></RequireAuth>} />
          <Route path="/admin/events/:id/edit" element={<RequireAuth><EventForm /></RequireAuth>} />

          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

function RequireAuth({ children }: { children: JSX.Element }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  return children
}
