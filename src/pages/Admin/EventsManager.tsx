import React from 'react'
import Header from '@/components/Navigation/Header'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { eventsApi } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Plus, Edit, Trash2, Calendar } from 'lucide-react'

const fetchEvents = async () => {
  try {
    const data = await eventsApi.adminList()
    return data
  } catch (e) {
    // Fallback to public list if adminList fails (shouldn't happen normally)
    console.error('adminList failed, falling back to public list', e)
    const data = await eventsApi.list()
    return data
  }
}

const AdminEvents: React.FC = () => {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { data: events, isLoading } = useQuery({ queryKey: ['events'], queryFn: fetchEvents })

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esse evento?')) return
    await eventsApi.delete(id)
    qc.invalidateQueries({ queryKey: ['events'] })
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', { month: 'short', day: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Gerenciar Eventos</h1>
            <p className="text-muted-foreground">Total: <span className="font-semibold text-primary">{events?.length || 0}</span> eventos</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => navigate('/admin/events/new')}
              className="bg-gradient-primary"
            >
              <Plus className="w-4 h-4 mr-2" /> Novo Evento
            </Button>
            <Button onClick={() => navigate('/admin')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Carregando eventos...</p>
          </div>
        )}

        {!isLoading && events && events.length === 0 && (
          <Card className="bg-gradient-card border-carnival-gold/20">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Nenhum evento cadastrado ainda</p>
              <Button 
                onClick={() => navigate('/admin/events/new')}
                className="bg-gradient-primary"
              >
                Criar Primeiro Evento
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events?.map((e: any) => (
            <Card key={e.id} className="bg-gradient-card border-carnival-gold/20 hover:shadow-carnival transition-shadow overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-lg line-clamp-1 flex-1">{e.nome}</CardTitle>
                  {e.data && (
                    <div className="flex items-center gap-1 text-xs bg-primary/10 px-2 py-1 rounded">
                      <Calendar className="w-3 h-3" />
                      <span className="text-primary font-semibold">{formatDate(e.data)}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2 min-h-10">
                  {e.descricao || 'Sem descrição'}
                </p>
                <div className="space-y-2">
                  {e.local && <p className="text-xs text-primary"><span className="font-semibold">Local:</span> {e.local}</p>}
                  {e.cidade && <p className="text-xs text-primary"><span className="font-semibold">Cidade:</span> {e.cidade}</p>}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    onClick={() => navigate(`/admin/events/${e.id}/edit`)}
                    className="flex-1 bg-primary/20 text-primary hover:bg-primary/30"
                  >
                    <Edit className="w-4 h-4 mr-1" /> Editar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleDelete(e.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminEvents
