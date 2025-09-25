import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, Users, Filter } from 'lucide-react';
import { handleGenericAction } from '@/utils/toast';
import Header from '@/components/Navigation/Header';
import { mockBlocks } from '@/data/blocks';

interface Event {
  id: string;
  blocoNome: string;
  blocoId: string;
  tipo: string;
  titulo: string;
  data: string;
  horario: string;
  local: string;
  cidade: string;
  estado: string;
  descricao: string;
  preco?: string;
  capacidade?: string;
}

const mockEvents: Event[] = [
  {
    id: "1",
    blocoNome: "Rosas da Resistência",
    blocoId: "1",
    tipo: "Ensaio",
    titulo: "Ensaio Aberto - Novas Integrantes",
    data: "2024-01-15",
    horario: "19:00",
    local: "Centro Cultural da Vila Madalena",
    cidade: "São Paulo",
    estado: "SP",
    descricao: "Venha conhecer nosso bloco! Ensaio aberto para mulheres interessadas em fazer parte da nossa resistência musical.",
    preco: "Gratuito",
    capacidade: "50 pessoas"
  },
  {
    id: "2",
    blocoNome: "Vozes Livres",
    blocoId: "2",
    tipo: "Desfile",
    titulo: "Desfile do Pré-Carnaval",
    data: "2024-02-10",
    horario: "15:00",
    local: "Avenida Paulista",
    cidade: "São Paulo",
    estado: "SP",
    descricao: "Grande desfile de abertura da temporada carnavalesca com foco na ancestralidade africana.",
    preco: "Gratuito"
  },
  {
    id: "3",
    blocoNome: "Maré Feminista",
    blocoId: "4",
    tipo: "Show",
    titulo: "Show Beneficente - Mulheres em Luta",
    data: "2024-01-25",
    horario: "20:00",
    local: "Lapa 40 Graus",
    cidade: "Rio de Janeiro",
    estado: "RJ",
    descricao: "Show beneficente com toda renda revertida para organizações feministas.",
    preco: "R$ 25,00",
    capacidade: "300 pessoas"
  },
  {
    id: "4",
    blocoNome: "Rosas da Resistência",
    blocoId: "1",
    tipo: "Oficina",
    titulo: "Oficina de Percussão Feminina",
    data: "2024-01-20",
    horario: "14:00",
    local: "Praça da República",
    cidade: "São Paulo",
    estado: "SP",
    descricao: "Aprenda técnicas de percussão em um ambiente acolhedor e feminista.",
    preco: "R$ 30,00",
    capacidade: "25 pessoas"
  },
  {
    id: "5",
    blocoNome: "Axé das Minas",
    blocoId: "6",
    tipo: "Ensaio",
    titulo: "Ensaio de Rua no Pelourinho",
    data: "2024-01-18",
    horario: "16:00",
    local: "Largo do Pelourinho",
    cidade: "Salvador",
    estado: "BA",
    descricao: "Ensaio tradicional nas ruas históricas de Salvador, aberto ao público.",
    preco: "Gratuito"
  }
];

const Agenda: React.FC = () => {
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  
  const tiposEvento = ['todos', 'Ensaio', 'Oficina', 'Desfile', 'Show'];
  
  const eventosFiltrados = filtroTipo === 'todos' 
    ? mockEvents 
    : mockEvents.filter(evento => evento.tipo === filtroTipo);

  const getEventTypeColor = (tipo: string) => {
    const colors = {
      'Ensaio': 'bg-primary/10 text-primary',
      'Oficina': 'bg-carnival-purple/10 text-carnival-purple',
      'Desfile': 'bg-carnival-gold/10 text-carnival-gold',
      'Show': 'bg-carnival-pink/10 text-carnival-pink'
    };
    return colors[tipo as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-4">
            Agenda dos Blocos Feministas
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubra ensaios, oficinas, desfiles e shows dos blocos feministas pelo Brasil
          </p>
        </div>
        
        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {tiposEvento.map((tipo) => (
                <Button
                  key={tipo}
                  variant={filtroTipo === tipo ? "carnival" : "outline"}
                  size="sm"
                  onClick={() => setFiltroTipo(tipo)}
                  className="capitalize"
                >
                  {tipo}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Events Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventosFiltrados.map((evento) => (
            <Card key={evento.id} className="group bg-gradient-card hover:shadow-carnival transition-smooth">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between mb-2">
                  <Badge className={getEventTypeColor(evento.tipo)}>
                    {evento.tipo}
                  </Badge>
                  <div className="text-right text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(evento.data).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      <Clock className="w-3 h-3" />
                      {evento.horario}
                    </div>
                  </div>
                </div>
                
                <CardTitle className="text-lg group-hover:gradient-text transition-smooth">
                  {evento.titulo}
                </CardTitle>
                
                <CardDescription className="text-primary font-medium">
                  {evento.blocoNome}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {evento.descricao}
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{evento.local}</span>
                  </div>
                  <div className="text-muted-foreground">
                    {evento.cidade}, {evento.estado}
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-2 border-t border-border/50">
                  <div className="space-y-1">
                    {evento.preco && (
                      <p className="text-sm font-medium text-carnival-gold">
                        {evento.preco}
                      </p>
                    )}
                    {evento.capacidade && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="w-3 h-3" />
                        {evento.capacidade}
                      </div>
                    )}
                  </div>
                  
                  <Button 
                    variant="carnival" 
                    size="sm"
                    onClick={() => handleGenericAction('Participar do evento')}
                  >
                    Participar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {eventosFiltrados.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum evento encontrado</h3>
              <p className="text-muted-foreground">
                Não há eventos do tipo "{filtroTipo}" agendados no momento.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Agenda;