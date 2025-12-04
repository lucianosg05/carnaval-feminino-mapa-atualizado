import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Calendar, MapPin, Clock, Users, Filter, Check } from 'lucide-react';
import { handleGenericAction } from '@/utils/toast';
import Header from '@/components/Navigation/Header';
import { useQuery } from '@tanstack/react-query'
import { eventsApi, blocksApi } from '@/lib/api'

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


interface ApiEvent {
  id: string;
  nome: string;
  data: string;
  descricao?: string;
  foto?: string;
  blocoId: string;
  bloco?: any;
  local?: string;
  cidade?: string;
  estado?: string;
}

const Agenda: React.FC = () => {
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  
  const tiposEvento = ['todos', 'Ensaio', 'Oficina', 'Desfile', 'Show'];
  const { data: events = [] } = useQuery({ queryKey: ['events'], queryFn: () => eventsApi.list() })
  const { data: blocks = [] } = useQuery({ queryKey: ['blocks'], queryFn: () => blocksApi.list() })

  const eventos = (events as ApiEvent[]).map(ev => ({
    id: ev.id,
    blocoNome: ev.bloco?.nome || (blocks.find((b: any) => b.id === ev.blocoId)?.nome) || '',
    blocoId: ev.blocoId,
    tipo: (ev as any).tipo || 'Evento',
    titulo: ev.nome,
    data: ev.data,
    horario: (ev as any).horario || '',
    foto: ev.foto || '',
    local: ev.local || '',
    cidade: ev.cidade || '',
    estado: ev.estado || '',
    descricao: ev.descricao || ''
  }))

  // Resolve image URL: if event foto is absolute, return as-is; if relative, prefix backend base URL
  const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'
  const uploadsBase = apiBase.replace(/\/api\/?$/, '')
  const resolveImageUrl = (path: string) => {
    if (!path) return ''
    if (path.startsWith('http://') || path.startsWith('https://')) return path
    // ensure leading slash
    const p = path.startsWith('/') ? path : `/${path}`
    return `${uploadsBase}${p}`
  }

  const eventosFiltrados = filtroTipo === 'todos'
    ? eventos
    : eventos.filter(evento => evento.tipo === filtroTipo)

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

  const [participatingEvents, setParticipatingEvents] = useState<Set<string>>(new Set());
  const [participateDialogOpen, setParticipateDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [participantName, setParticipantName] = useState('');
  const [participantEmail, setParticipantEmail] = useState('');

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
                    {evento.foto ? (
                      <div className="w-full h-40 overflow-hidden rounded-md mb-2">
                        <img
                          src={resolveImageUrl(evento.foto)}
                          alt={evento.titulo}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : null}
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
                    onClick={() => {
                      setSelectedEvent(evento);
                      setParticipateDialogOpen(true);
                    }}
                  >
                    {participatingEvents.has(evento.id) ? (
                      <>
                        <Check className="w-3 h-3 mr-1" />
                        Inscrito
                      </>
                    ) : (
                      'Participar'
                    )}
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

        {/* Dialog Participar */}
        <Dialog open={participateDialogOpen} onOpenChange={setParticipateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Inscrição no Evento</DialogTitle>
              <DialogDescription>
                Preencha seus dados para participar de "{selectedEvent?.titulo}"
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Nome completo</label>
                <Input 
                  placeholder="Seu nome"
                  value={participantName}
                  onChange={(e) => setParticipantName(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input 
                  type="email"
                  placeholder="seu@email.com"
                  value={participantEmail}
                  onChange={(e) => setParticipantEmail(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div className="bg-muted p-3 rounded-lg text-sm">
                <p><strong>📅 Data:</strong> {selectedEvent?.data ? formatDate(selectedEvent.data) : 'A confirmar'}</p>
                <p><strong>⏰ Horário:</strong> {selectedEvent?.horario || 'A confirmar'}</p>
                <p><strong>📍 Local:</strong> {selectedEvent?.local || 'A confirmar'}</p>
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setParticipateDialogOpen(false);
                    setParticipantName('');
                    setParticipantEmail('');
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  variant="carnival"
                  onClick={() => {
                    if (!participantName || !participantEmail) {
                      handleGenericAction('Preencha todos os campos!');
                      return
                    }

                    try {
                      // mark locally as participating
                      const newParticipating = new Set(participatingEvents);
                      newParticipating.add(selectedEvent!.id);
                      setParticipatingEvents(newParticipating);

                      // Find block using evento
                      const bloco = eventos.find(ev => ev.id === selectedEvent?.id)?.blocoId
                      const block = (blocks as any[]).find(b => b.id === bloco)
                      
                      console.log('Block found:', block)
                      console.log('Contact string:', block?.contato)

                      if (!block || !block.contato) {
                        handleGenericAction('Contato do bloco não disponível.');
                        setParticipateDialogOpen(false);
                        setParticipantName('');
                        setParticipantEmail('');
                        return
                      }

                      // Extract emails and phones
                      const contactStr = block.contato;
                      const emails: string[] = []
                      const phones: string[] = []
                      
                      const parts = contactStr.split('|').map((p: string) => p.trim());
                      parts.forEach((part: string) => {
                        if (part.includes('@')) {
                          emails.push(part);
                        } else {
                          const digits = part.replace(/\D/g, '');
                          if (digits.length >= 10) {
                            const normalized = (digits.length === 10 || digits.length === 11) ? `55${digits}` : digits;
                            phones.push(normalized);
                          }
                        }
                      });

                      console.log('Extracted emails:', emails, 'phones:', phones);

                      const primaryEmail = emails[0] || null;
                      const primaryPhone = phones[0] || null;

                      if (primaryEmail) {
                        const subject = `Participação no evento: ${selectedEvent?.titulo}`;
                        const body = `Olá,%0D%0A%0D%0AMeu nome é ${participantName} (email: ${participantEmail}). Gostaria de participar do evento "${selectedEvent?.titulo}" agendado para ${selectedEvent?.data} às ${selectedEvent?.horario}.%0D%0A%0D%0AObrigado(a).`;
                        window.location.href = `mailto:${primaryEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                        handleGenericAction('Abrindo email... 📧');
                      } else if (primaryPhone) {
                        const waText = `Olá, meu nome é ${participantName}. Gostaria de participar do evento ${selectedEvent?.titulo} em ${selectedEvent?.data}.`;
                        const waUrl = `https://wa.me/${primaryPhone}?text=${encodeURIComponent(waText)}`;
                        window.open(waUrl, '_blank');
                        handleGenericAction('Abrindo WhatsApp... 📱');
                      } else {
                        handleGenericAction('Nenhum contato válido encontrado.');
                      }

                      setParticipateDialogOpen(false);
                      setParticipantName('');
                      setParticipantEmail('');
                    } catch (e) {
                      console.error('Erro completo:', e);
                      handleGenericAction('Erro ao processar inscrição. Tente novamente.');
                    }
                  }}
                  className="flex-1"
                >
                  Confirmar Inscrição
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Agenda;