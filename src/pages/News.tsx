import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, User, MessageSquare, Heart, Share, Mail, Copy, MessageCircle } from 'lucide-react';
import { handleGenericAction } from '@/utils/toast';
import Header from '@/components/Navigation/Header';

interface NewsItem {
  id: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  autor: string;
  data: string;
  categoria: string;
  imagem: string;
  blocoRelacionado?: string;
}

const mockNews: NewsItem[] = [
  {
    id: "1",
    titulo: "Blocos Feministas Ganham Força no Carnaval 2024",
    resumo: "Movimento de blocos carnavalescos feministas cresce 40% em todo o país, promovendo inclusão e empoderamento.",
    conteudo: "O movimento de blocos carnavalescos feministas tem ganhado cada vez mais força no Brasil...",
    autor: "Maria Santos",
    data: "2024-01-10",
    categoria: "Movimento",
    imagem: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop",
    blocoRelacionado: "Rosas da Resistência"
  },
  {
    id: "2",
    titulo: "Oficina de Percussão Feminina Forma Nova Geração",
    resumo: "Iniciativa em São Paulo capacita mais de 200 mulheres em técnicas de percussão e empoderamento.",
    conteudo: "A oficina de percussão feminina realizada pelo bloco Rosas da Resistência...",
    autor: "Ana Costa",
    data: "2024-01-08",
    categoria: "Educação",
    imagem: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=600&h=400&fit=crop"
  },
  {
    id: "3",
    titulo: "Mulheres do Frevo Revolucionam Carnaval de Recife",
    resumo: "Bloco pernambucano traz nova perspectiva ao frevo tradicional com coreografias empoderadoras.",
    conteudo: "O Mulheres do Frevo está transformando o cenário carnavalesco de Recife...",
    autor: "Joana Silva",
    data: "2024-01-05",
    categoria: "Cultura",
    imagem: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=600&h=400&fit=crop",
    blocoRelacionado: "Mulheres do Frevo"
  },
  {
    id: "4",
    titulo: "Financiamento Coletivo Viabiliza Instrumentos para Blocos",
    resumo: "Campanha arrecada R$ 50 mil para compra de instrumentos musicais para blocos feministas de periferia.",
    conteudo: "Uma iniciativa de crowdfunding conseguiu arrecadar recursos importantes...",
    autor: "Carla Oliveira",
    data: "2024-01-03",
    categoria: "Financiamento",
    imagem: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=600&h=400&fit=crop"
  },
  {
    id: "5",
    titulo: "Parceria com Escolas Leva Educação Feminista às Salas de Aula",
    resumo: "Blocos feministas desenvolvem projeto educacional para conscientização de jovens estudantes.",
    conteudo: "A parceria entre blocos feministas e escolas públicas está levando...",
    autor: "Beatriz Lima",
    data: "2023-12-28",
    categoria: "Educação",
    imagem: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&h=400&fit=crop"
  }
];

const News: React.FC = () => {
  const [likedNews, setLikedNews] = useState<Set<string>>(new Set());
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [commentDialogOpen, setCommentDialogOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [comment, setComment] = useState('');
  
  const getCategoryColor = (categoria: string) => {
    const colors = {
      'Movimento': 'bg-primary/10 text-primary',
      'Educação': 'bg-carnival-purple/10 text-carnival-purple',
      'Cultura': 'bg-carnival-gold/10 text-carnival-gold',
      'Financiamento': 'bg-carnival-pink/10 text-carnival-pink'
    };
    return colors[categoria as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
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
            Notícias e Comunicação
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Fique por dentro das últimas novidades do movimento de blocos feministas
          </p>
        </div>
        
        {/* Featured Article */}
        {mockNews.length > 0 && (
          <Card className="mb-8 overflow-hidden bg-gradient-card">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src={mockNews[0].imagem} 
                  alt={mockNews[0].titulo}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className={getCategoryColor(mockNews[0].categoria)}>
                    {mockNews[0].categoria}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {formatDate(mockNews[0].data)}
                  </div>
                </div>
                
                <h2 className="text-2xl font-bold gradient-text mb-3">
                  {mockNews[0].titulo}
                </h2>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {mockNews[0].resumo}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-primary" />
                    <span>{mockNews[0].autor}</span>
                  </div>
                  
                  <Button variant="carnival">
                    Ler Mais
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
        
        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockNews.slice(1).map((noticia) => (
            <Card key={noticia.id} className="group bg-gradient-card hover:shadow-carnival transition-smooth overflow-hidden">
              <div className="relative">
                <img 
                  src={noticia.imagem} 
                  alt={noticia.titulo}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-smooth"
                />
                <Badge 
                  className={`absolute top-3 left-3 ${getCategoryColor(noticia.categoria)}`}
                >
                  {noticia.categoria}
                </Badge>
              </div>
              
              <CardHeader className="pb-3">
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(noticia.data)}
                </div>
                
                <CardTitle className="text-lg group-hover:gradient-text transition-smooth line-clamp-2">
                  {noticia.titulo}
                </CardTitle>
                
                <CardDescription className="line-clamp-3">
                  {noticia.resumo}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-primary" />
                    <span>{noticia.autor}</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-2"
                      onClick={() => {
                        const newLiked = new Set(likedNews);
                        if (newLiked.has(noticia.id)) {
                          newLiked.delete(noticia.id);
                          handleGenericAction('Removido de favoritos 💔');
                        } else {
                          newLiked.add(noticia.id);
                          handleGenericAction('Adicionado aos favoritos ❤️');
                        }
                        setLikedNews(newLiked);
                      }}
                    >
                      <Heart className={`w-4 h-4 ${likedNews.has(noticia.id) ? 'fill-current text-red-500' : ''}`} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-2"
                      onClick={() => {
                        setSelectedNews(noticia);
                        setShareDialogOpen(true);
                      }}
                    >
                      <Share className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-2"
                      onClick={() => {
                        setSelectedNews(noticia);
                        setCommentDialogOpen(true);
                      }}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Newsletter Section */}
        <Card className="mt-12 bg-gradient-primary text-white">
          <CardContent className="text-center py-12">
            <h3 className="text-2xl font-bold mb-4">
              Receba as novidades em primeira mão
            </h3>
            <p className="text-white/90 mb-6 max-w-md mx-auto">
              Cadastre-se em nossa newsletter e fique por dentro de tudo que acontece no movimento feminista
            </p>
            <div className="flex gap-2 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Seu e-mail"
                className="flex-1 px-4 py-2 rounded-lg text-foreground"
              />
              <Button variant="festive">
                Cadastrar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Dialog Compartilhar */}
        <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Compartilhar Notícia</DialogTitle>
              <DialogDescription>
                Compartilhe "{selectedNews?.titulo}" com seus amigos
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  const url = window.location.href;
                  const text = `Confira: ${selectedNews?.titulo} - ${url}`;
                  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
                  window.open(whatsappUrl, '_blank');
                  handleGenericAction('Abrindo WhatsApp... 📱');
                  setShareDialogOpen(false);
                }}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Compartilhar no WhatsApp
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  const subject = `Confira: ${selectedNews?.titulo}`;
                  const body = `${selectedNews?.resumo}\n\n${window.location.href}`;
                  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                  handleGenericAction('Abrindo cliente de email... 📧');
                  setShareDialogOpen(false);
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
                  setShareDialogOpen(false);
                }}
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar Link
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Dialog Comentar */}
        <Dialog open={commentDialogOpen} onOpenChange={setCommentDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Deixar um Comentário</DialogTitle>
              <DialogDescription>
                Compartilhe sua opinião sobre esta notícia
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Digite seu comentário aqui..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="min-h-24"
              />
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setCommentDialogOpen(false);
                    setComment('');
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  variant="carnival"
                  onClick={() => {
                    if (comment.trim()) {
                      handleGenericAction('Comentário enviado! 🎉');
                      setCommentDialogOpen(false);
                      setComment('');
                    } else {
                      handleGenericAction('Digite um comentário!');
                    }
                  }}
                  className="flex-1"
                >
                  Publicar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default News;