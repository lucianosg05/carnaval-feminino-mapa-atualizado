// Contexto e provider de autenticação com Firebase
import React, { createContext, useContext, useEffect, useState } from 'react'
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth'
import { auth as firebaseAuth } from '@/lib/firebase'
import { setToken, getToken } from '@/lib/api'

// Tipo para o usuário autenticado
type User = { id: string; email: string } | null

// Criação do contexto de autenticação
const AuthContext = createContext<{
  user: User
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
}>({ 
  user: null, 
  login: async () => {}, 
  register: async () => {}, 
  logout: async () => {},
  loading: true
})

// Provider de autenticação que envolve a aplicação
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User>(null)
  const [loading, setLoading] = useState(true) // Indica se a verificação de autenticação está em andamento

  // Hook que verifica o estado de autenticação ao carregar a aplicação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Usuário autenticado: obter token do Firebase e armazenar
        const token = await firebaseUser.getIdToken()
        setToken(token)
        setUser({ id: firebaseUser.uid, email: firebaseUser.email || '' })
      } else {
        // Usuário desautenticado: limpar token e dados
        setToken(null)
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Função para registrar novo usuário
  const register = async (email: string, password: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password)
      const token = await userCredential.user.getIdToken()
      setToken(token)
      setUser({ id: userCredential.user.uid, email: userCredential.user.email || '' })
    } catch (error: any) {
      const errorMessage = error.code === 'auth/email-already-in-use' 
        ? 'Este email já está registrado'
        : error.message || 'Erro ao criar conta'
      throw new Error(errorMessage)
    }
  }

  // Função para fazer login
  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password)
      const token = await userCredential.user.getIdToken()
      setToken(token)
      setUser({ id: userCredential.user.uid, email: userCredential.user.email || '' })
    } catch (error: any) {
      const errorMessage = error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password'
        ? 'Email ou senha incorretos'
        : error.message || 'Erro ao fazer login'
      throw new Error(errorMessage)
    }
  }

  // Função para fazer logout
  const logout = async () => {
    try {
      await signOut(firebaseAuth)
      setToken(null)
      setUser(null)
    } catch (error: any) {
      throw new Error(error.message || 'Erro ao fazer logout')
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook para acessar contexto de autenticação em qualquer componente
export const useAuth = () => useContext(AuthContext)
