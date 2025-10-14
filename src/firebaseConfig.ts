import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  doc,
} from 'firebase/firestore'

const apiKey = import.meta.env.VITE_FB_API_KEY
const authDomain = import.meta.env.VITE_FB_AUTH_DOMAIN
const projectId = import.meta.env.VITE_FB_PROJECT_ID
const storageBucket = import.meta.env.VITE_FB_STORAGE_BUCKET
const messagingSenderId = import.meta.env.VITE_FB_MESSAGING_SENDER_ID
const appId = import.meta.env.VITE_FB_APP_ID

const firebaseConfig = {
  apiKey: apiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const db = getFirestore(app)
export {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  doc,
}
