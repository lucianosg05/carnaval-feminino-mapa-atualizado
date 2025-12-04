import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Music, Calendar, MessageSquare, MapPin, LogOut } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth/AuthProvider';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navItems = [
    { label: 'Mapa', icon: MapPin, path: '/' },
    { label: 'Agenda', icon: Calendar, path: '/agenda' },
    { label: 'Notícias', icon: MessageSquare, path: '/noticias' }
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center group-hover:shadow-glow transition-smooth">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold gradient-text">Blocos Feministas</h1>
              <p className="text-sm text-muted-foreground">Mapeando a resistência cultural</p>
            </div>
          </div>
          
          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Button
                  key={item.path}
                  variant={isActive ? "carnival" : "ghost"}
                  size="sm"
                  onClick={() => navigate(item.path)}
                  className="flex items-center gap-2"
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Button>
              );
            })}
            <Button onClick={() => user ? navigate('/admin') : navigate('/login')} size="sm" variant="outline">
              Admin
            </Button>
            {user && (
              <Button 
                onClick={handleLogout} 
                size="sm" 
                variant="ghost"
                disabled={isLoggingOut}
                className="flex items-center gap-2 text-red-600 hover:text-red-700"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </Button>
            )}
          </nav>
          
        </div>
        
        {/* Mobile Navigation: icons-only to save space */}
        <nav className="md:hidden flex justify-center gap-2 mt-4 pt-4 border-t border-border/50">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? "carnival" : "ghost"}
                size="sm"
                onClick={() => navigate(item.path)}
                className="flex items-center gap-0 px-2 py-2"
              >
                <item.icon className="w-5 h-5" />
                <span className="sr-only">{item.label}</span>
              </Button>
            );
          })}
          <Button onClick={() => user ? navigate('/admin') : navigate('/login')} size="sm" variant="outline" className="px-2 py-2">
            <span className="sr-only">Admin</span>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <path d="M12 12a5 5 0 100-10 5 5 0 000 10zM4 20a8 8 0 0116 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Button>
          {user && (
            <Button 
              onClick={handleLogout} 
              size="sm" 
              variant="ghost"
              disabled={isLoggingOut}
              className="px-2 py-2 text-red-600 hover:text-red-700"
            >
              <LogOut className="w-5 h-5" />
              <span className="sr-only">Sair</span>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;