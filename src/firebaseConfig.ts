import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'

const firebaseConfig = {
  apiKey: 'AIzaSyDLd1u-Uifj4ivGw447HJBs8WrmeuH8nIc',
  authDomain: 'zoo-chat-48ce2.firebaseapp.com',
  projectId: 'zoo-chat-48ce2',
  storageBucket: 'zoo-chat-48ce2.firebasestorage.app',
  messagingSenderId: '839373938824',
  appId: '1:839373938824:web:bb98a70ce7132cbc4abf3d',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
