import React from 'react'
import { Button } from '@/components/ui/button'
import Header from '@/components/Navigation/Header'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthProvider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Calendar, LogOut, ArrowRight } from 'lucide-react'

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  
  const handleLogout = () => {
    logout()
    navigate('/')
  }
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold gradient-text mb-2">Painel do Administrador</h1>
          <p className="text-muted-foreground">Bem-vindo, <span className="font-semibold text-primary">{user?.email}</span></p>
        </div>

        {/* Grid de opções */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Card Blocos */}
          <Card className="bg-gradient-card border-carnival-gold/20 hover:shadow-carnival transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-primary" />
                </div>
              </div>
              <CardTitle className="text-xl">Gerenciar Blocos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Criar, editar e excluir blocos carnavalescos
              </p>
              <Button 
                onClick={() => navigate('/admin/blocks')}
                className="w-full bg-gradient-primary"
              >
                Acessar <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Card Eventos */}
          <Card className="bg-gradient-card border-carnival-gold/20 hover:shadow-carnival transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-carnival-gold/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-carnival-gold" />
                </div>
              </div>
              <CardTitle className="text-xl">Gerenciar Eventos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Criar, editar e excluir eventos dos blocos
              </p>
              <Button 
                onClick={() => navigate('/admin/events')}
                className="w-full bg-gradient-primary"
              >
                Acessar <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Card Logout */}
          <Card className="bg-gradient-card border-red-500/20 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <LogOut className="w-6 h-6 text-red-500" />
                </div>
              </div>
              <CardTitle className="text-xl">Sair</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Fazer logout e retornar à página inicial
              </p>
              <Button 
                onClick={handleLogout}
                variant="destructive"
                className="w-full"
              >
                Logout <LogOut className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
