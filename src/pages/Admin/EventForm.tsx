import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Header from '@/components/Navigation/Header'
import { eventsApi, blocksApi } from '@/lib/api'
import { Button } from '@/components/ui/button'

const EventForm: React.FC = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [blocks, setBlocks] = useState<any[]>([])
  const [form, setForm] = useState<any>({ nome: '', descricao: '', blocoId: '', data: '', horario: '', tipo: 'Ensaio', local: '', cidade: '', estado: '' })

  useEffect(() => {
    ;(async () => { try { const bs = await blocksApi.adminList(); setBlocks(bs) } catch (e) { console.error('Could not load admin blocks', e); const bs = await blocksApi.list(); setBlocks(bs) } })()
    if (id) { (async () => { try { const d = await eventsApi.adminGet(id); setForm({ ...d, horario: d.horario || '', tipo: d.tipo || 'Ensaio' }) } catch (err) { alert('Você não tem permissão para editar este evento.'); navigate('/admin/events') } })() }
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const fd = new FormData()
      // Append fields properly; if foto is a File, append as file
      for (const [k, v] of Object.entries(form)) {
        if (v === undefined || v === null) continue
        if (k === 'foto' && v instanceof File) {
          fd.append('foto', v)
        } else {
          fd.append(k, String(v))
        }
      }
      if (id) await eventsApi.update(id, fd)
      else await eventsApi.create(fd)
      navigate('/admin/events')
    } catch (err) { alert('Erro: ' + err) }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">{id ? 'Editar Evento' : 'Novo Evento'}</h1>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 max-w-2xl">
          <input placeholder="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} className="p-2 border" />
          <textarea placeholder="Descrição" value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} className="p-2 border" />
          <select value={form.blocoId} onChange={(e) => setForm({ ...form, blocoId: e.target.value })} className="p-2 border">
            <option value="">Selecionar bloco</option>
            {blocks.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
          </select>
          <input type="date" value={form.data?.slice?.(0,10) || ''} onChange={(e) => setForm({ ...form, data: e.target.value })} className="p-2 border" />
          <div className="flex gap-2 items-center">
            <label className="text-sm">Horário</label>
            <input type="time" value={form.horario || ''} onChange={(e) => setForm({ ...form, horario: e.target.value })} className="p-2 border" />
            <label className="text-sm">Tipo</label>
            <select value={form.tipo} onChange={(e) => setForm({ ...form, tipo: e.target.value })} className="p-2 border">
              <option value="Ensaio">Ensaio</option>
              <option value="Oficina">Oficina</option>
              <option value="Desfile">Desfile</option>
              <option value="Show">Show</option>
            </select>
          </div>
          <input placeholder="Local" value={form.local} onChange={(e) => setForm({ ...form, local: e.target.value })} className="p-2 border" />
          <div className="flex gap-2">
            <input placeholder="Cidade" value={form.cidade} onChange={(e) => setForm({ ...form, cidade: e.target.value })} className="p-2 border flex-1" />
            <input placeholder="Estado" value={form.estado} onChange={(e) => setForm({ ...form, estado: e.target.value })} className="p-2 border flex-1" />
          </div>
          <input type="file" onChange={(e) => { if (e.target.files) setForm({ ...form, foto: e.target.files[0] }) }} />
          <div className="flex gap-2">
            <Button type="submit">{loading ? 'Salvando...' : 'Salvar'}</Button>
            <Button variant="ghost" onClick={() => navigate('/admin/events')}>Cancelar</Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventForm
