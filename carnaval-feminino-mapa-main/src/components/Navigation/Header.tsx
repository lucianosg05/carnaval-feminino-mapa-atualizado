import React from 'react';
import { Button } from '@/components/ui/button';
import { Music, Calendar, MessageSquare, MapPin } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

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
          </nav>
          
        </div>
        
        {/* Mobile Navigation */}
        <nav className="md:hidden flex justify-center gap-2 mt-4 pt-4 border-t border-border/50">
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
        </nav>
      </div>
    </header>
  );
};

export default Header;