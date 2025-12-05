import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Mail, Calendar, Home, CheckCircle2, Clock } from 'lucide-react';
import { handleGenericAction } from '@/utils/toast';

interface Block {
  id: string;
  nome: string;
  descricao: string;
  contato: string;
  foto: string;
  local: [number, number];
  cidade: string;
  estado: string;
  endereco: string;
  vertenteFeminista: string;
  formacao: string;
  cache?: string;
  historia?: string;
  estilo?: string;
  redesSociais?: string | string[];
}

interface BlockCardProps {
  block: Block;
  onViewProfile: (blockId: string) => void;
  onSelectOnMap: (blockId: string) => void;
  isSelected?: boolean;
}

const BlockCard: React.FC<BlockCardProps> = ({ 
  block, 
  onViewProfile, 
  onSelectOnMap,
  isSelected = false 
}) => {
  // Helper to render a social link text as a clickable anchor when possible
  function renderSocialLink(raw: string) {
    if (!raw) return null
    const s = raw.trim()
    if (s.startsWith('http')) {
      return <a href={s} target="_blank" rel="noreferrer" className="text-primary underline">{s}</a>
    }
    if (s.startsWith('@')) {
      const handle = s.replace('@', '')
      return <a href={`https://instagram.com/${handle}`} target="_blank" rel="noreferrer" className="text-primary underline">{s}</a>
    }
    // fallback: plain text
    return <span className="text-muted-foreground">{s}</span>
  }
  return (
    <Card className={`group bg-gradient-card hover:shadow-carnival transition-smooth animate-float flex flex-col h-full ${
      isSelected ? 'ring-2 ring-primary shadow-glow' : ''
    }`}>
      <div className="relative overflow-hidden rounded-t-lg">
        <img 
          src={block.foto || 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"%3E%3Crect width="400" height="300" fill="%23f0e6ff"/%3E%3Ctext x="50%" y="50%" font-size="24" fill="%236b5b95" text-anchor="middle" dominant-baseline="middle"%3ESem foto%3C/text%3E%3C/svg%3E'} 
          alt={block.nome}
          className="w-full h-40 sm:h-44 md:h-48 object-cover group-hover:scale-105 transition-smooth"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <Badge 
          variant="secondary" 
          className="absolute top-3 right-3 bg-white/90 text-primary font-semibold"
        >
          {block.estado}
        </Badge>
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="gradient-text text-xl line-clamp-2">{block.nome}</CardTitle>
        <CardDescription className="text-muted-foreground line-clamp-2">
          {block.descricao}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 flex-1 flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
            <span className="truncate">{block.cidade}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-carnival-purple flex-shrink-0" />
            <span className="truncate">{block.formacao}</span>
          </div>
        </div>
        
        <div className="space-y-2 flex-1">
          <Badge variant="outline" className="text-xs line-clamp-2">
            {block.vertenteFeminista}
          </Badge>
          {block.cache && (
            <Badge variant="secondary" className="text-xs bg-carnival-gold/20 text-carnival-gold">
              Cachê: {block.cache}
            </Badge>
          )}
          {block.redesSociais && (
            <div className="mt-2 text-sm">
              {typeof block.redesSociais === 'string' ? (
                renderSocialLink(block.redesSociais)
              ) : Array.isArray(block.redesSociais) ? (
                block.redesSociais.slice(0,3).map((r, i) => (
                  <span key={i} className="mr-2">{renderSocialLink(r)}</span>
                ))
              ) : null}
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2 pt-2 mt-auto">
          <Button 
            variant="carnival" 
            size="sm" 
            onClick={() => onViewProfile(block.id)}
            className="w-full sm:flex-1"
          >
            Ver Perfil
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onSelectOnMap(block.id)}
            className="w-full sm:w-auto px-3"
          >
            <MapPin className="w-4 h-4" />
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(`mailto:${block.contato}`, '_blank')}
          className="w-full flex items-center gap-2 rounded-none border-t border-border/50 text-xs text-muted-foreground hover:bg-primary/5 h-9 justify-start px-3"
        >
          <Mail className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{block.contato}</span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default BlockCard;