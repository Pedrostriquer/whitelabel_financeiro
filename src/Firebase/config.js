// Dentro de src/firebase/config.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

console.log("API Key Carregada:", process.env.REACT_APP_API_KEY);

// A sua configuração do Firebase, lendo das variáveis de ambiente seguras
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};


// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa os serviços que vamos usar e os exporta
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;