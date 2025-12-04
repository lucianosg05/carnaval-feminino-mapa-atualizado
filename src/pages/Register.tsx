import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/auth/AuthProvider'
import { AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'

const Register: React.FC = () => {
  const navigate = useNavigate()
  const { register, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Se já está autenticado, redireciona para admin
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Carregando autenticação...</p>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Todos os campos são obrigatórios')
      return
    }
    
    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres')
      return
    }
    
    if (password !== confirmPassword) {
      setError('As senhas não conferem')
      return
    }
    
    setLoading(true)
    try {
      await register(email, password)
      setSuccess('Conta criada com sucesso! Redirecionando...')
      setTimeout(() => navigate('/admin'), 2000)
    } catch (err: any) {
      const msg = err && err.message ? err.message : String(err)
      console.error('Register error', err)
      setError(msg.includes('already') ? 'Este email já está cadastrado' : msg)
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-carnival-purple/5 p-4">
      {/* Botão Voltar - Canto Superior Esquerdo */}
      <div className="fixed top-4 left-4 z-50">
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para Home
        </Button>
      </div>

      <div className="w-full max-w-md">

        {/* Logo/Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-2">Blocos Feministas</h1>
          <p className="text-muted-foreground">Criar Conta Administrativa</p>
        </div>

        <Card className="bg-gradient-card border-carnival-gold/20">
          <CardHeader>
            <CardTitle className="text-center text-2xl">Cadastrar</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-600">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              )}
              
              {success && (
                <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-600">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <p className="text-sm">{success}</p>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Email</label>
                <Input 
                  type="email"
                  placeholder="seu@email.com" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Senha</label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="bg-background/50"
                />
                <p className="text-xs text-muted-foreground mt-1">Mínimo 6 caracteres</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground mb-1 block">Confirmar Senha</label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={confirmPassword} 
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="bg-background/50"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-gradient-primary hover:shadow-glow" 
                disabled={loading}
              >
                {loading ? 'Cadastrando...' : 'Criar Conta'}
              </Button>
              
              <div className="text-sm text-center text-muted-foreground">
                Já tem conta?{' '}
                <button 
                  type="button"
                  onClick={() => navigate('/login')} 
                  className="text-primary hover:underline font-medium"
                >
                  Entrar
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Register
