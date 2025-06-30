// Script simples para testar configuração do Firebase
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBlznzwe_cuk3X2QCXHYpqCx6UGh1HOxSI",
  authDomain: "lexai-ef0ab.firebaseapp.com",
  projectId: "lexai-ef0ab",
  storageBucket: "lexai-ef0ab.firebasestorage.app",
  messagingSenderId: "506027619372",
  appId: "1:506027619372:web:9ccd54f560d1abbc970d89",
  measurementId: "G-933QQQFSSY"
};

try {
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);
  
  console.log("✅ Firebase inicializado com sucesso!");
  console.log("Auth:", auth ? "Conectado" : "Erro");
  console.log("Firestore:", db ? "Conectado" : "Erro");
  console.log("Project ID:", firebaseConfig.projectId);
} catch (error) {
  console.error("❌ Erro ao inicializar Firebase:", error);
}