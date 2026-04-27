import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getAuth, 
  GoogleAuthProvider, 
  initializeAuth, 
  browserLocalPersistence 
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase only if the API key is present
const isFirebaseConfigured = !!firebaseConfig.apiKey;

let app;
if (isFirebaseConfigured) {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
} else {
  console.warn("Firebase API Key is missing. Some features (auth, database) will be disabled.");
}

// Initialize Firebase services with null fallbacks if not configured
export const auth = (isFirebaseConfigured && app) 
  ? (getApps().length === 0 ? initializeAuth(app, { persistence: browserLocalPersistence }) : getAuth(app))
  : null;

export const db = (isFirebaseConfigured && app) ? getFirestore(app) : null;
export const googleProvider = isFirebaseConfigured ? new GoogleAuthProvider() : null;

export default app;

