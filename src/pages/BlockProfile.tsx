import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowLeft, MapPin, Users, Mail, Calendar, Music, Heart, Share2, AlertCircle, MessageCircle, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query'
import { blocksApi } from '@/lib/api'
import Header from '@/components/Navigation/Header';
import { handleGenericAction } from '@/utils/toast';

const BlockProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [openDialog, setOpenDialog] = useState<'schedule' | 'report' | 'share' | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ date: '', location: '', details: '' });
  const [reportForm, setReportForm] = useState({ type: 'bug', description: '' });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const { data: block, isLoading } = useQuery({ queryKey: ['block', id], queryFn: () => blocksApi.get(id as string), enabled: !!id })
  if (isLoading) return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">Carregando...</div>
    </div>
  )
  
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
            
            {/* Gallery Section */}
            {block.imagens && Array.isArray(block.imagens) && block.imagens.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Galeria de Fotos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Main Image with Navigation */}
                    <div className="relative overflow-hidden rounded-lg aspect-square bg-muted">
                      <img 
                        src={block.imagens[currentImageIndex]} 
                        alt={`Foto ${currentImageIndex + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {/* Left Arrow */}
                      <button
                        onClick={() => setCurrentImageIndex((prev) => prev === 0 ? block.imagens.length - 1 : prev - 1)}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                        aria-label="Imagem anterior"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      {/* Right Arrow */}
                      <button
                        onClick={() => setCurrentImageIndex((prev) => prev === block.imagens.length - 1 ? 0 : prev + 1)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                        aria-label="Próxima imagem"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                      {/* Image Counter */}
                      <div className="absolute bottom-2 right-2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {block.imagens.length}
                      </div>
                    </div>
                    {/* Thumbnail Grid */}
                    {block.imagens.length > 1 && (
                      <div className="grid grid-cols-4 gap-2">
                        {block.imagens.map((imagem, index) => (
                          <button
                            key={index}
                            onClick={() => setCurrentImageIndex(index)}
                            className={`relative overflow-hidden rounded-lg aspect-square border-2 transition-all ${
                              index === currentImageIndex 
                                ? 'border-primary' 
                                : 'border-muted-foreground/25 hover:border-primary/50'
                            }`}
                          >
                            <img 
                              src={imagem} 
                              alt={`Miniatura ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Galeria de Fotos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 flex flex-col items-center justify-center bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/25">
                    <svg className="w-12 h-12 text-muted-foreground mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-muted-foreground text-center text-sm">
                      Nenhuma imagem adicionada ainda
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Videos Section */}
            {block.videos && Array.isArray(block.videos) && block.videos.length > 0 ? (
              <Card>
                <CardHeader>
                  <CardTitle>Vídeos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {block.videos.map((video, index) => (
                      <div key={index} className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                        <iframe
                          src={video}
                          className="w-full h-full"
                          allowFullScreen
                          title={`Vídeo ${index + 1}`}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Vídeos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-32 flex flex-col items-center justify-center bg-muted/50 rounded-lg border-2 border-dashed border-muted-foreground/25">
                    <svg className="w-8 h-8 text-muted-foreground mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-muted-foreground text-center text-sm">
                      Nenhum vídeo adicionado ainda
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

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
                  
                  {block.dias && (
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Dias que o Bloco Sai</p>
                        <p className="text-sm text-muted-foreground">{block.dias}</p>
                      </div>
                    </div>
                  )}
                  
                  {block.atividades && (
                    <div className="flex items-start gap-3">
                      <Heart className="w-5 h-5 text-carnival-purple flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium">Atividades Realizadas</p>
                        <div className="text-sm text-muted-foreground space-y-1">
                          {block.atividades.split('|').filter(Boolean).map((ativ, idx) => {
                            const labels: {[key: string]: string} = {
                              venda: 'Venda de produtos para arrecadação',
                              encontros: 'Encontros, festas e shows cobrados',
                              ensaios_publico: 'Ensaios abertos ao público',
                              ensaios_aprendizado: 'Ensaios e aprendizagem',
                              oficinas: 'Oficinas de formação rítmica',
                              protesto: 'Eventos de protesto feminista',
                              dialogos: 'Diálogos institucionais',
                              formacao_politica: 'Formação política feminista'
                            };
                            if (ativ.startsWith('outro:')) {
                              const customText = ativ.replace('outro:', '');
                              return customText ? <div key={idx}>• {customText}</div> : null;
                            }
                            if (ativ === 'outro') {
                              return null;
                            }
                            return <div key={idx}>• {labels[ativ] || ativ}</div>;
                          })}
                        </div>
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
                  <Button 
                    variant="carnival" 
                    className="flex-1"
                    onClick={() => {
                      const email = (block as any).responsavelEmail || (block.contato && block.contato.includes('@') ? block.contato : null)
                      if (email) {
                        window.location.href = `mailto:${email}`;
                        handleGenericAction('Abrindo cliente de email...');
                      } else {
                        handleGenericAction('Email do responsável não disponível');
                      }
                    }}
                  >
                    Entrar em Contato
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => {
                      setIsFavorited(!isFavorited);
                      handleGenericAction(isFavorited ? 'Removido dos favoritos 💔' : 'Adicionado aos favoritos ❤️');
                    }}
                  >
                    <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current text-red-500' : ''}`} />
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
                <Button 
                  variant="festive" 
                  className="w-full"
                  onClick={() => setOpenDialog('schedule')}
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Apresentação
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setOpenDialog('share')}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Compartilhar Perfil
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setOpenDialog('report')}
                >
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Reportar Problema
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dialog Agendar Apresentação */}
        <Dialog open={openDialog === 'schedule'} onOpenChange={(open) => !open && setOpenDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agendar Apresentação</DialogTitle>
              <DialogDescription>
                Preencha os dados para agendar uma apresentação com {block?.nome}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Data desejada</label>
                <Input 
                  type="date" 
                  value={scheduleForm.date}
                  onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Local/Evento</label>
                <Input 
                  placeholder="Ex: Carnaval de Rua - Pça da República"
                  value={scheduleForm.location}
                  onChange={(e) => setScheduleForm({...scheduleForm, location: e.target.value})}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Detalhes adicionais</label>
                <Textarea 
                  placeholder="Informações sobre o evento, público esperado, etc."
                  value={scheduleForm.details}
                  onChange={(e) => setScheduleForm({...scheduleForm, details: e.target.value})}
                  className="min-h-20"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setOpenDialog(null)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  variant="carnival"
                  onClick={() => {
                    if (scheduleForm.date && scheduleForm.location) {
                      const email = (block as any).responsavelEmail || (block.contato && block.contato.includes('@') ? block.contato : null)
                      if (!email) { handleGenericAction('Email do responsável não disponível'); return }
                      const subject = `Solicitação de Apresentação - ${block?.nome}`;
                      const body = `Data: ${scheduleForm.date}\nLocal: ${scheduleForm.location}\nDetalhes: ${scheduleForm.details}`;
                      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                      setOpenDialog(null);
                      handleGenericAction('Email de solicitação aberto! 📧');
                    } else {
                      handleGenericAction('Preencha data e local!');
                    }
                  }}
                  className="flex-1"
                >
                  Enviar Solicitação
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog Reportar Problema */}
        <Dialog open={openDialog === 'report'} onOpenChange={(open) => !open && setOpenDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reportar Problema</DialogTitle>
              <DialogDescription>
                Ajude-nos a melhorar relatando problemas ou inconsistências
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tipo de problema</label>
                <select
                  value={reportForm.type}
                  onChange={(e) => setReportForm({...reportForm, type: e.target.value})}
                  className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background text-sm"
                >
                  <option value="bug">Erro/Bug</option>
                  <option value="info">Informação incorreta</option>
                  <option value="missing">Dado faltando</option>
                  <option value="inappropriate">Conteúdo inadequado</option>
                  <option value="other">Outro</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Descrição do problema</label>
                <Textarea 
                  placeholder="Descreva detalhadamente o problema encontrado..."
                  value={reportForm.description}
                  onChange={(e) => setReportForm({...reportForm, description: e.target.value})}
                  className="min-h-24"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setOpenDialog(null)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  variant="carnival"
                  onClick={() => {
                    if (reportForm.description) {
                      const subject = `[Report] ${reportForm.type} - ${block?.nome}`;
                      const body = `Tipo: ${reportForm.type}\n\nDescrição:\n${reportForm.description}\n\nBloco: ${block?.nome}\nURL: ${window.location.href}`;
                      window.location.href = `mailto:contato@blocosfeministas.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                      setOpenDialog(null);
                      handleGenericAction('Relatório enviado! Obrigada por nos ajudar. 🙏');
                    } else {
                      handleGenericAction('Descreva o problema!');
                    }
                  }}
                  className="flex-1"
                >
                  Enviar Relatório
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog Compartilhar */}
        <Dialog open={openDialog === 'share'} onOpenChange={(open) => !open && setOpenDialog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Compartilhar Perfil</DialogTitle>
              <DialogDescription>
                Compartilhe {block?.nome} com seus amigos
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  const url = window.location.href;
                  const text = `Confira o bloco feminista ${block?.nome}: ${url}`;
                  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
                  window.open(whatsappUrl, '_blank');
                  handleGenericAction('Abrindo WhatsApp... 📱');
                  setOpenDialog(null);
                }}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Compartilhar no WhatsApp
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  const subject = `Confira: ${block?.nome}`;
                  const body = `Olá! Encontrei este bloco feminista e achei que você se interessaria: ${window.location.href}`;
                  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  handleGenericAction('Abrindo cliente de email... 📧');
                  setOpenDialog(null);
                }}
              >
                <Mail className="w-4 h-4 mr-2" />
                Compartilhar por Email
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  handleGenericAction('Link copiado para clipboard! 📋');
                  setOpenDialog(null);
                }}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar Link
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default BlockProfile;