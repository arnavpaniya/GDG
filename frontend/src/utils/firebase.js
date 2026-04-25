import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  initializeAuth, 
  browserLocalPersistence 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDigwC7TKpRALnKgEuSdMB51Yy81nR8xhk",
  authDomain: "nyaya-ai-hackathon-2026.firebaseapp.com",
  projectId: "nyaya-ai-hackathon-2026",
  storageBucket: "nyaya-ai-hackathon-2026.firebasestorage.app",
  messagingSenderId: "961887252239",
  appId: "1:961887252239:web:f2785624d08d1c2a52987a"
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
// Using initializeAuth with explicit persistence for better Next.js compatibility
export const auth = getApps().length === 0 
  ? initializeAuth(app, { persistence: browserLocalPersistence })
  : getAuth(app);

export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;
