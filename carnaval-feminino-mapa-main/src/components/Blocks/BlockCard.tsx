import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Users, Mail, Calendar, Home } from 'lucide-react';
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
  return (
    <Card className={`group bg-gradient-card hover:shadow-carnival transition-smooth animate-float ${
      isSelected ? 'ring-2 ring-primary shadow-glow' : ''
    }`}>
      <div className="relative overflow-hidden rounded-t-lg">
        <img 
          src={block.foto} 
          alt={block.nome}
          className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
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
        <CardTitle className="gradient-text text-xl">{block.nome}</CardTitle>
        <CardDescription className="text-muted-foreground line-clamp-2">
          {block.descricao}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="truncate">{block.cidade}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-carnival-purple" />
            <span className="truncate">{block.formacao}</span>
          </div>
        </div>
        
        <div className="flex items-start gap-2 text-xs text-muted-foreground">
          <Home className="w-3 h-3 mt-1 text-primary flex-shrink-0" />
          <span className="line-clamp-2">{block.endereco}</span>
        </div>
        
        <div className="space-y-2">
          <Badge variant="outline" className="text-xs">
            {block.vertenteFeminista}
          </Badge>
          {block.cache && (
            <Badge variant="secondary" className="text-xs bg-carnival-gold/20 text-carnival-gold">
              Cachê: {block.cache}
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2 pt-2">
          <Button 
            variant="carnival" 
            size="sm" 
            onClick={() => onViewProfile(block.id)}
            className="flex-1"
          >
            Ver Perfil
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onSelectOnMap(block.id)}
            className="px-3"
          >
            <MapPin className="w-4 h-4" />
          </Button>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(`mailto:${block.contato}`, '_blank')}
          className="w-full flex items-center gap-2 pt-2 border-t border-border/50 rounded-none hover:bg-primary/5"
        >
          <Mail className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground truncate">{block.contato}</span>
        </Button>
      </CardContent>
    </Card>
  );
};

export default BlockCard;