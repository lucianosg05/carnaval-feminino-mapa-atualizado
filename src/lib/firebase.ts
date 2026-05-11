// Configuração do Firebase: autenticação, armazenamento em nuvem e realtime database
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth'; // Autenticação (email/password, OAuth, etc)
import { getStorage } from 'firebase/storage'; // Armazenamento de arquivos em nuvem

// Credenciais do Firebase: conecta a aplicação ao projeto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAOkohIBrCrmWlgMB3qAGaiSHKUgGdfEfU",
  authDomain: "sistema-de-blocos-carnaval.firebaseapp.com",
  projectId: "sistema-de-blocos-carnaval",
  storageBucket: "sistema-de-blocos-carnaval.firebasestorage.app",
  messagingSenderId: "622904443920",
  appId: "1:622904443920:web:3162e91e563280a6fcb695",
  measurementId: "G-VVQSQQBL93"
};

// Inicializa Firebase com as credenciais
const app = initializeApp(firebaseConfig);

// Serviço de autenticação: gerencia login, registro, logout
export const auth = getAuth(app);

// Serviço de armazenamento: guarda arquivos na nuvem (fotos, vídeos, etc)
export const storage = getStorage(app);

export default app;
