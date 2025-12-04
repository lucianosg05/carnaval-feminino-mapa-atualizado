import React from 'react'
import Header from '@/components/Navigation/Header'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { blocksApi } from '@/lib/api'
import { useAuth } from '@/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Plus, Edit, Trash2 } from 'lucide-react'

const normalizeBlock = (block: any) => {
  if (!block) return block
  const b = { ...block }
  try {
    b.imagens = typeof b.imagens === 'string' ? JSON.parse(b.imagens) : (b.imagens || [])
  } catch (e) {
    b.imagens = []
  }
  try {
    b.videos = typeof b.videos === 'string' ? JSON.parse(b.videos) : (b.videos || [])
  } catch (e) {
    b.videos = []
  }
  return b
}

const fetchBlocks = async () => {
  // Use blocksApi.adminList which centralizes token handling
  try {
    const data = await blocksApi.adminList()
    return Array.isArray(data) ? data.map(normalizeBlock) : []
  } catch (error: any) {
    console.error('Erro ao buscar blocos (adminList):', error)
    throw error
  }
}

const AdminBlocks: React.FC = () => {
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { user } = useAuth()
  const { data: blocks, isLoading, error } = useQuery({ 
    queryKey: ['blocks', 'admin', user?.id], 
    queryFn: fetchBlocks,
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
    gcTime: 1000 * 60 * 10, // Manter em memória por 10 minutos
  })

  const handleDelete = async (id: string) => {
    if (!confirm('Excluir esse bloco?')) return
    await blocksApi.delete(id)
    qc.invalidateQueries({ queryKey: ['blocks', 'admin', user?.id] })
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">Gerenciar Blocos</h1>
            <p className="text-muted-foreground">Total: <span className="font-semibold text-primary">{blocks?.length || 0}</span> blocos</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={() => navigate('/admin/blocks/new')}
              className="bg-gradient-primary"
            >
              <Plus className="w-4 h-4 mr-2" /> Novo Bloco
            </Button>
            <Button onClick={() => navigate('/admin')} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
            </Button>
          </div>
        </div>

        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Carregando blocos...</p>
          </div>
        )}

        {error && (
          <Card className="bg-red-50 border-red-200 mb-6">
            <CardContent className="pt-6">
              <p className="text-red-800">Erro ao carregar blocos: {error instanceof Error ? error.message : 'Erro desconhecido'}</p>
            </CardContent>
          </Card>
        )}

        {!isLoading && blocks && blocks.length === 0 && (
          <Card className="bg-gradient-card border-carnival-gold/20">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Nenhum bloco cadastrado ainda</p>
              <Button 
                onClick={() => navigate('/admin/blocks/new')}
                className="bg-gradient-primary"
              >
                Criar Primeiro Bloco
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blocks?.map((b: any) => (
            <Card key={b.id} className="bg-gradient-card border-carnival-gold/20 hover:shadow-carnival transition-shadow overflow-hidden">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg line-clamp-1">{b.nome}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2 min-h-10">
                  {b.descricao || 'Sem descrição'}
                </p>
                <div className="space-y-2">
                  {b.cidade && <p className="text-xs text-primary"><span className="font-semibold">Cidade:</span> {b.cidade}</p>}
                  {b.formacao && <p className="text-xs text-primary"><span className="font-semibold">Formação:</span> {b.formacao}</p>}
                </div>
                <div className="flex gap-2 pt-2">
                  <Button 
                    size="sm" 
                    onClick={() => navigate(`/admin/blocks/${b.id}/edit`)}
                    className="flex-1 bg-primary/20 text-primary hover:bg-primary/30"
                  >
                    <Edit className="w-4 h-4 mr-1" /> Editar
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleDelete(b.id)}
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

export default AdminBlocks
