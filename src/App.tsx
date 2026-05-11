// Importações de componentes UI e bibliotecas principais
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // Gerenciador de estado de requisições HTTP
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Roteamento da aplicação
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
import { AuthProvider, useAuth } from './auth/AuthProvider' // Fornecedor de contexto de autenticação
import { Navigate } from 'react-router-dom'

// Cliente do React Query para gerenciamento de cache e sincronização de dados
const queryClient = new QueryClient();

// Componente raiz da aplicação com wrappers de contexto e roteamento
const App = () => (
  <QueryClientProvider client={queryClient}>
    {/* TooltipProvider: contexto global para tooltips */}
    <TooltipProvider>
      {/* Toasters: componentes para exibir notificações */}
      <Toaster />
      <Sonner />
      {/* AuthProvider: fornece contexto de autenticação para toda a app */}
      <AuthProvider>
      <BrowserRouter>
        {/* Definição das rotas da aplicação */}
        <Routes>
          {/* Rotas públicas */}
          <Route path="/" element={<Index />} />
          <Route path="/bloco/:id" element={<BlockProfile />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/noticias" element={<News />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Rotas protegidas: apenas usuários autenticados podem acessar */}
          <Route path="/admin" element={<RequireAuth><AdminDashboard /></RequireAuth>} />
          <Route path="/admin/blocks" element={<RequireAuth><ErrorBoundary><AdminBlocks /></ErrorBoundary></RequireAuth>} />
          <Route path="/admin/blocks/new" element={<RequireAuth><ErrorBoundary><BlockForm /></ErrorBoundary></RequireAuth>} />
          <Route path="/admin/blocks/:id/edit" element={<RequireAuth><ErrorBoundary><BlockForm /></ErrorBoundary></RequireAuth>} />

          <Route path="/admin/events" element={<RequireAuth><AdminEvents /></RequireAuth>} />
          <Route path="/admin/events/new" element={<RequireAuth><EventForm /></RequireAuth>} />
          <Route path="/admin/events/:id/edit" element={<RequireAuth><EventForm /></RequireAuth>} />

          {/* Rota catch-all: deve estar por último para capturar rotas não encontradas */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

// Componente HOC para proteger rotas: redireciona usuários não autenticados para login
function RequireAuth({ children }: { children: JSX.Element }) {
  const { user } = useAuth()
  // Se não há usuário autenticado, redireciona para a página de login
  if (!user) return <Navigate to="/login" replace />
  return children
}
