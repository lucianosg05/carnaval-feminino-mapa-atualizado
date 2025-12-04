import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '@/components/Navigation/Header'
import { blocksApi } from '@/lib/api'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/auth/AuthProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Save, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

const BlockForm: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState<any>({ 
    nome: '', 
    descricao: '', 
    contato: '', 
    cidade: '', 
    estado: '', 
    endereco: '', 
    formacao: '', 
    vertenteFeminista: '', 
    localLat: '', 
    localLng: '',
    redesSociais: '',
    atividades: '',
    dias: '',
    imagensCount: 0,
    videosCount: 0
  })

  // Refs to hold selected File objects (do not store File in React state)
  const fotoRef = useRef<File | null>(null)
  const imagensRef = useRef<File[]>([])
  const videosRef = useRef<File[]>([])

  useEffect(() => {
    if (id) {
      ;(async () => {
        try {
          const data = await blocksApi.get(id)
          // Normalize fetched block into form shape
          const normalized: any = {
            nome: data.nome ?? '',
            descricao: data.descricao ?? '',
            contato: data.contato ?? '',
            cidade: data.cidade ?? '',
            estado: data.estado ?? '',
            endereco: data.endereco ?? '',
            formacao: data.formacao ?? '',
            vertenteFeminista: data.vertenteFeminista ?? '',
            localLat: data.localLat != null ? String(data.localLat) : '',
            localLng: data.localLng != null ? String(data.localLng) : '',
            redesSociais: data.redesSociais ?? '',
            atividades: data.atividades ?? '',
            dias: data.dias ?? '',
            fotoUrl: data.foto ?? '',
            imagens: Array.isArray(data.imagens) ? data.imagens : [],
            videos: Array.isArray(data.videos) ? data.videos : []
          }
          setForm(normalized)
        } catch (err) {
          setError('Erro ao carregar bloco')
        }
      })()
    }
  }, [id])

  // Geocode address to coordinates using Nominatim
  const geocodeAddress = async (address: string) => {
    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`;
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (!res.ok) return null;
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const item = data[0];
        return { lat: Number(item.lat), lng: Number(item.lon) };
      }
      return null;
    } catch (err) {
      console.error('Geocoding error', err);
      return null;
    }
  }

  // Optimized handlers to avoid unnecessary re-renders (useCallback + try/catch)
  const handleInputChange = useCallback((field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    try {
      const value = e.target.value
      setForm((prev: any) => ({ ...prev, [field]: value }))
    } catch (err) {
      console.error('handleInputChange error', err)
      setError('Erro ao editar campo')
    }
  }, [])

  const handleImageSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files.length > 0) {
        const files = Array.from(e.target.files)
        imagensRef.current = files
        setForm((prev: any) => ({ ...prev, imagensCount: files.length }))
        console.log('handleImageSelect - files selected:', files.map(f => f.name))
      }
    } catch (err) {
      console.error('handleImageSelect error', err)
      setError('Erro ao selecionar imagens')
    }
  }, [])

  const handleVideoSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files.length > 0) {
        const files = Array.from(e.target.files)
        videosRef.current = files
        setForm((prev: any) => ({ ...prev, videosCount: files.length }))
        console.log('handleVideoSelect - files selected:', files.map(f => f.name))
      }
    } catch (err) {
      console.error('handleVideoSelect error', err)
      setError('Erro ao selecionar vídeos')
    }
  }, [])

  const handlePhotoSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0]
        fotoRef.current = file
        // create a preview URL for the selected photo
        const preview = URL.createObjectURL(file)
        setForm((prev: any) => ({ ...prev, fotoUrl: preview }))
        console.log('handlePhotoSelect - photo selected:', file.name)
      }
    } catch (err) {
      console.error('handlePhotoSelect error', err)
      setError('Erro ao selecionar foto')
    }
  }, [])

  const handleRemoveImage = useCallback((index: number) => {
    try {
      const newImagens = form.imagens.filter((_: any, i: number) => i !== index)
      setForm((prev: any) => ({ ...prev, imagens: newImagens }))
      console.log('Image removed:', index)
    } catch (err) {
      console.error('handleRemoveImage error', err)
      setError('Erro ao remover imagem')
    }
  }, [form.imagens])

  const handleRemoveVideo = useCallback((index: number) => {
    try {
      const newVideos = form.videos.filter((_: any, i: number) => i !== index)
      setForm((prev: any) => ({ ...prev, videos: newVideos }))
      console.log('Video removed:', index)
    } catch (err) {
      console.error('handleRemoveVideo error', err)
      setError('Erro ao remover vídeo')
    }
  }, [form.videos])

  const handleSubmit = async (e: React.FormEvent) => {
    e?.preventDefault()
    setError('')
    setSuccess('')
    console.log('handleSubmit - triggered. file refs:', { foto: fotoRef.current ? fotoRef.current.name : null, imagens: imagensRef.current.length, videos: videosRef.current.length })
    
    if (!form.nome.trim()) {
      setError('Nome é obrigatório')
      return
    }
    
    setLoading(true)
    try {
      // If no coords but we have address info, try geocoding now
      let lat = form.localLat
      let lng = form.localLng
      if ((!lat || !lng) && (form.endereco || form.cidade || form.estado)) {
        const query = [form.endereco, form.cidade, form.estado].filter(Boolean).join(', ')
        const coords = await geocodeAddress(query)
        if (coords) {
          lat = String(coords.lat)
          lng = String(coords.lng)
          setForm((s: any) => ({ ...s, localLat: lat, localLng: lng }))
        } else {
          setError('Não foi possível localizar o endereço informado')
          setLoading(false)
          return
        }
      }

      const fd = new FormData()

      // Add all text fields
      fd.append('nome', form.nome)
      fd.append('descricao', form.descricao || '')
      fd.append('contato', form.contato || '')
      fd.append('cidade', form.cidade || '')
      fd.append('estado', form.estado || '')
      fd.append('endereco', form.endereco || '')
      fd.append('formacao', form.formacao || '')
      fd.append('vertenteFeminista', form.vertenteFeminista || '')
      fd.append('localLat', lat || '')
      fd.append('localLng', lng || '')
      fd.append('redesSociais', form.redesSociais || '')
      fd.append('atividades', form.atividades || '')
      fd.append('dias', form.dias || '')

      // Add files from refs (only sent when Save is clicked)
      if (fotoRef.current) {
        fd.append('foto', fotoRef.current)
      }

      if (imagensRef.current && imagensRef.current.length > 0) {
        imagensRef.current.forEach((file) => fd.append('imagens', file))
      }

      if (videosRef.current && videosRef.current.length > 0) {
        videosRef.current.forEach((file) => fd.append('videos', file))
      }

      console.log('Submitting block form with data:', { ...form, localLat: lat, localLng: lng })

      if (id) {
        await blocksApi.update(id, fd)
      } else {
        await blocksApi.create(fd)
      }
      // Invalidate admin blocks and public blocks cache so the manager view refreshes
      try {
        await qc.invalidateQueries({ queryKey: ['blocks', 'admin', user?.id] })
        await qc.invalidateQueries({ queryKey: ['blocks'] })
      } catch (invalidateErr) {
        console.warn('Erro ao invalidar cache de blocos:', invalidateErr)
      }

      setSuccess('Bloco salvo com sucesso!')
      setTimeout(() => navigate('/admin/blocks'), 500)
    } catch (err: any) { 
      console.error('Full error object:', err)
      console.error('Error message:', err.message)
      const errorMsg = err.message || 'Falha ao salvar'
      console.error('Showing error:', errorMsg)
      setError(errorMsg) 
    }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              {id ? 'Editar Bloco' : 'Novo Bloco'}
            </h1>
            <p className="text-muted-foreground">
              {id ? 'Atualize as informações do bloco' : 'Crie um novo bloco de carnaval'}
            </p>
          </div>
          <Button onClick={() => navigate('/admin/blocks')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{success}</AlertDescription>
          </Alert>
        )}

        <Card className="bg-gradient-card border-carnival-gold/20 max-w-2xl">
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-base font-semibold">
                  Nome do Bloco *
                </Label>
                <Input
                  id="nome"
                  placeholder="Ex: Gigantes da Lapa"
                  value={form.nome}
                  onChange={handleInputChange('nome')}
                  className="bg-background/50"
                  required
                />
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="descricao" className="text-base font-semibold">
                  Descrição
                </Label>
                <Textarea
                  id="descricao"
                  placeholder="Descrição do bloco"
                  value={form.descricao}
                  onChange={handleInputChange('descricao')}
                  className="bg-background/50 min-h-24"
                />
              </div>

              {/* Contato e Formação */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contato" className="text-sm font-semibold">
                    Contato
                  </Label>
                  <Input
                    id="contato"
                    placeholder="Email ou telefone"
                    value={form.contato}
                    onChange={handleInputChange('contato')}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="formacao" className="text-sm font-semibold">
                    Formação
                  </Label>
                  <Input
                    id="formacao"
                    placeholder="Ex: Misto, Mulheres"
                    value={form.formacao}
                    onChange={handleInputChange('formacao')}
                    className="bg-background/50"
                  />
                </div>
              </div>

              {/* Atividades */}
              <div className="space-y-3">
                <Label className="text-sm font-semibold">
                  Atividades Realizadas
                </Label>
                <div className="space-y-2 bg-background/30 p-4 rounded-lg border border-muted-foreground/10">
                  {[
                    { id: 'venda', label: 'Venda de produtos tais como camisetas e outros para arrecadação' },
                    { id: 'encontros', label: 'Encontros, festas, shows e outros eventos sendo cobrados' },
                    { id: 'ensaios_publico', label: 'Encontros para ensaio e abertos ao Público' },
                    { id: 'ensaios_aprendizado', label: 'Encontros para ensaio e aprendizagem das participantes.' },
                    { id: 'oficinas', label: 'Oficinas de formação rítmica para novos integrantes' },
                    { id: 'protesto', label: 'Participação em eventos de protesto com temática feminista, classista, de combate à opressão/exploração' },
                    { id: 'dialogos', label: 'Diálogos institucionais com o poder público para viabilizar desfiles, ensaios e apresentações' },
                    { id: 'formacao_politica', label: 'Formação política feminista em sintonia com os objetivos do grupo' },
                    { id: 'outro', label: 'Outro:' }
                  ].map((item) => (
                    <div key={item.id}>
                      <div className="flex items-start gap-2">
                        <input
                          type="checkbox"
                          id={`atividade_${item.id}`}
                          className="mt-1 w-4 h-4 cursor-pointer accent-primary"
                          checked={form.atividades?.includes(item.id) || false}
                          onChange={(e) => {
                            const atividades = form.atividades || '';
                            const ativArray = atividades.split('|').filter((x) => !x.startsWith('outro:'));
                            if (e.target.checked) {
                              if (!ativArray.includes(item.id)) ativArray.push(item.id);
                            } else {
                              const idx = ativArray.indexOf(item.id);
                              if (idx > -1) ativArray.splice(idx, 1);
                            }
                            setForm((prev: any) => ({ ...prev, atividades: ativArray.join('|') }));
                          }}
                        />
                        <label htmlFor={`atividade_${item.id}`} className="text-sm text-muted-foreground cursor-pointer flex-1">
                          {item.label}
                        </label>
                      </div>
                      {item.id === 'outro' && form.atividades?.includes('outro') && (
                        <div className="ml-6 mt-2">
                          <Input
                            type="text"
                            placeholder="Descreva a atividade..."
                            value={
                              form.atividades
                                ?.split('|')
                                .find((x: string) => x.startsWith('outro:'))
                                ?.replace('outro:', '') || ''
                            }
                            onChange={(e) => {
                              const atividades = form.atividades || '';
                              const ativArray = atividades.split('|').filter((x) => !x.startsWith('outro:'));
                              if (e.target.value.trim()) {
                                ativArray.push(`outro:${e.target.value}`);
                              }
                              setForm((prev: any) => ({ ...prev, atividades: ativArray.join('|') }));
                            }}
                            className="bg-background/50"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Dias */}
              <div className="space-y-2">
                <Label htmlFor="dias" className="text-sm font-semibold">
                  Dias que o Bloco Sai
                </Label>
                <Textarea
                  id="dias"
                  placeholder="Ex: Segunda, Quarta, Sábado durante o carnaval"
                  value={form.dias}
                  onChange={handleInputChange('dias')}
                  className="bg-background/50 min-h-20"
                />
              </div>

              {/* Cidade e Estado */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cidade" className="text-sm font-semibold">
                    Cidade
                  </Label>
                  <Input
                    id="cidade"
                    placeholder="Rio de Janeiro"
                    value={form.cidade}
                    onChange={handleInputChange('cidade')}
                    className="bg-background/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estado" className="text-sm font-semibold">
                    Estado
                  </Label>
                  <Input
                    id="estado"
                    placeholder="RJ"
                    value={form.estado}
                    onChange={handleInputChange('estado')}
                    maxLength={2}
                    className="bg-background/50"
                  />
                </div>
              </div>

              {/* Endereço */}
              <div className="space-y-2">
                <Label htmlFor="endereco" className="text-sm font-semibold">
                  Endereço
                </Label>
                <Input
                  id="endereco"
                  placeholder="Rua, número e complemento"
                  value={form.endereco}
                  onChange={handleInputChange('endereco')}
                  className="bg-background/50"
                />
              </div>

              {/* Vertente Feminista */}
              <div className="space-y-2">
                <Label htmlFor="vertenteFeminista" className="text-sm font-semibold">
                  Vertente Feminista
                </Label>
                <Textarea
                  id="vertenteFeminista"
                  placeholder="Descreva como o bloco incorpora perspectiva feminista..."
                  value={form.vertenteFeminista}
                  onChange={handleInputChange('vertenteFeminista')}
                  className="bg-background/50 min-h-20"
                />
              </div>

              {/* Localização (busca automática a partir do endereço) */}
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Localização (será encontrada a partir do endereço)</Label>
                <div className="mt-2 flex flex-col gap-2">
                  <div className="text-sm text-muted-foreground">
                    Ao salvar, se não houver latitude/longitude definida, o sistema tentará localizar o endereço informado automaticamente.
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground">
                      {form.localLat && form.localLng ? (
                        <>Latitude: {Number(form.localLat).toFixed(5)} • Longitude: {Number(form.localLng).toFixed(5)}</>
                      ) : (
                        <>Nenhuma coordenada encontrada ainda</>
                      )}
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={async (e) => {
                        e.preventDefault()
                        try {
                          console.log('Encontrar localização - clicado', { endereco: form.endereco, cidade: form.cidade, estado: form.estado })
                          if (!form.endereco && !form.cidade && !form.estado) {
                            setError('Preencha ao menos o endereço, cidade ou estado para buscar a localização')
                            return
                          }
                          setError('')
                          setSuccess('Buscando localização...')
                          const query = [form.endereco, form.cidade, form.estado].filter(Boolean).join(', ')
                          const coords = await geocodeAddress(query)
                          if (coords) {
                            console.log('Geocode result:', coords)
                            setForm((s: any) => ({ ...s, localLat: String(coords.lat), localLng: String(coords.lng) }))
                            setSuccess('Localização encontrada e preenchida')
                          } else {
                            console.log('Geocode returned null')
                            setError('Não foi possível localizar o endereço')
                          }
                        } catch (geErr) {
                          console.error('Erro ao buscar localização:', geErr)
                          setError('Erro ao buscar localização')
                        } finally {
                          setTimeout(() => setSuccess(''), 2000)
                        }
                      }}
                    >
                      Encontrar localização
                    </Button>
                  </div>
                </div>
              </div>

              {/* Upload de Foto */}
              <div className="space-y-2">
                <Label htmlFor="foto" className="text-sm font-semibold">
                  Foto Principal do Bloco
                </Label>
                <Input
                  id="foto"
                  type="file"
                  accept="image/*"
                  onClick={(e) => e.stopPropagation()}
                  onFocus={(e) => e.stopPropagation()}
                  onChange={handlePhotoSelect}
                  className="bg-background/50 cursor-pointer"
                />
                  {form.fotoUrl && (
                    <div className="mt-2 relative inline-block">
                      <img src={form.fotoUrl} alt="Preview" className="w-48 h-32 object-cover rounded-md" />
                      <button
                        type="button"
                        onClick={() => {
                          fotoRef.current = null;
                          setForm((prev: any) => ({ ...prev, fotoUrl: '', foto: null }));
                        }}
                        className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition"
                        title="Remover foto"
                      >
                        ✕
                      </button>
                    </div>
                  )}
                <p className="text-xs text-muted-foreground">Recomendado: JPG ou PNG, máximo 2MB</p>
              </div>

              {/* Upload de Galeria de Fotos */}
              <div className="space-y-2">
                <Label htmlFor="imagens" className="text-sm font-semibold">
                  Galeria de Fotos (múltiplas)
                </Label>
                <Input
                  id="imagens"
                  type="file"
                  accept="image/*"
                  multiple
                  onClick={(e) => e.stopPropagation()}
                  onFocus={(e) => e.stopPropagation()}
                  onChange={handleImageSelect}
                  className="bg-background/50 cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">Selecione várias fotos para a galeria</p>
                {(form.imagensCount && form.imagensCount > 0) ? (
                  <div className="mt-2 text-sm text-green-600">✓ {form.imagensCount} foto(s) selecionada(s)</div>
                ) : (form.imagens && Array.isArray(form.imagens) && form.imagens.length > 0) ? (
                  <div className="mt-2">
                    <div className="text-sm text-muted-foreground mb-2">{form.imagens.length} foto(s) na galeria</div>
                    <div className="grid grid-cols-3 gap-2">
                      {form.imagens.map((img: string, idx: number) => (
                        <div key={idx} className="relative group">
                          <img src={img} alt={`Imagem ${idx}`} className="w-full h-20 object-cover rounded-md" />
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center rounded-md text-white font-bold text-lg"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Upload de Vídeos */}
              <div className="space-y-2">
                <Label htmlFor="videos" className="text-sm font-semibold">
                  Vídeos (múltiplos)
                </Label>
                <Input
                  id="videos"
                  type="file"
                  accept="video/*"
                  multiple
                  onClick={(e) => e.stopPropagation()}
                  onFocus={(e) => e.stopPropagation()}
                  onChange={handleVideoSelect}
                  className="bg-background/50 cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">Formatos aceitos: MP4, WebM, Ogg</p>
                {(form.videosCount && form.videosCount > 0) ? (
                  <div className="mt-2 text-sm text-green-600">✓ {form.videosCount} vídeo(s) selecionado(s)</div>
                ) : (form.videos && Array.isArray(form.videos) && form.videos.length > 0) ? (
                  <div className="mt-2">
                    <div className="text-sm text-muted-foreground mb-2">{form.videos.length} vídeo(s) existentes</div>
                    <div className="space-y-2">
                      {form.videos.map((vid: string, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
                          <span className="text-sm truncate">{vid.split('/').pop()}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveVideo(idx)}
                            className="px-2 py-1 bg-red-500/20 text-red-600 hover:bg-red-500/30 rounded text-sm font-semibold"
                          >
                            Remover
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Redes Sociais */}
              <div className="space-y-2">
                <Label htmlFor="redesSociais" className="text-sm font-semibold">
                  Redes Sociais (Instagram, Facebook, etc)
                </Label>
                <Input
                  id="redesSociais"
                  placeholder="@handle_instagram ou url completa"
                  value={form.redesSociais || ''}
                  onChange={handleInputChange('redesSociais')}
                  className="bg-background/50"
                />
              </div>

              {/* Botões */}
              <div className="flex gap-3 pt-4">
                <Button 
                  type="button" 
                  disabled={loading}
                  className="bg-gradient-primary flex-1"
                  onClick={handleSubmit}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {loading ? 'Salvando...' : 'Salvar Bloco'}
                </Button>
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/blocks')}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default BlockForm
