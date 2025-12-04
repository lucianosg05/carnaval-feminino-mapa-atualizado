import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAOkohIBrCrmWlgMB3qAGaiSHKUgGdfEfU",
  authDomain: "sistema-de-blocos-carnaval.firebaseapp.com",
  projectId: "sistema-de-blocos-carnaval",
  storageBucket: "sistema-de-blocos-carnaval.firebasestorage.app",
  messagingSenderId: "622904443920",
  appId: "1:622904443920:web:3162e91e563280a6fcb695",
  measurementId: "G-VVQSQQBL93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth = getAuth(app);

// Initialize Storage
export const storage = getStorage(app);

export default app;
