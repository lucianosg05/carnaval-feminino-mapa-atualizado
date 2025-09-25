import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, MapPin, Users, Mail, Calendar, Music, Heart } from 'lucide-react';
import { mockBlocks } from '@/data/blocks';
import Header from '@/components/Navigation/Header';

const BlockProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const block = mockBlocks.find(b => b.id === id);
  
  if (!block) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Bloco não encontrado</h1>
            <Button onClick={() => navigate('/')} variant="carnival">
              Voltar ao mapa
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao mapa
        </Button>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Hero Section */}
            <Card className="overflow-hidden bg-gradient-card">
              <div className="relative h-64 md:h-80">
                <img 
                  src={block.foto} 
                  alt={block.nome}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {block.nome}
                  </h1>
                  <div className="flex items-center gap-2 text-white/90">
                    <MapPin className="w-5 h-5" />
                    <span className="text-lg">{block.cidade}, {block.estado}</span>
                  </div>
                </div>
              </div>
            </Card>
            
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Sobre o Bloco
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {block.descricao}
                </p>
                {block.historia && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">História</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {block.historia}
                      </p>
                    </div>
                  </>
                )}
                {block.estilo && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Music className="w-4 h-4" />
                        Estilo Musical
                      </h3>
                      <p className="text-muted-foreground">
                        {block.estilo}
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
            
            {/* Events Section */}
            {block.proximosEventos && block.proximosEventos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Próximos Eventos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {block.proximosEventos.map((evento, index) => (
                      <div key={index} className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-primary" />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="secondary">{evento.tipo}</Badge>
                            <span className="text-sm text-muted-foreground">{evento.data}</span>
                          </div>
                          <h4 className="font-semibold">{evento.local}</h4>
                          <p className="text-sm text-muted-foreground">{evento.descricao}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <CardTitle>Informações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Formação</p>
                      <p className="text-sm text-muted-foreground">{block.formacao}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Contato</p>
                      <p className="text-sm text-muted-foreground">{block.contato}</p>
                    </div>
                  </div>
                  
                  {block.cache && (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 text-carnival-gold flex items-center justify-center">
                        💰
                      </div>
                      <div>
                        <p className="font-medium">Cachê</p>
                        <p className="text-sm text-muted-foreground">{block.cache}</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <Separator />
                
                <div>
                  <Badge variant="outline" className="w-full justify-center">
                    {block.vertenteFeminista}
                  </Badge>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="carnival" className="flex-1">
                    Entrar em Contato
                  </Button>
                  <Button variant="outline" size="icon">
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ações</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="festive" className="w-full">
                  Agendar Apresentação
                </Button>
                <Button variant="outline" className="w-full">
                  Compartilhar Perfil
                </Button>
                <Button variant="outline" className="w-full">
                  Reportar Problema
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlockProfile;