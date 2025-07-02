import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  
  apiKey: "AIzaSyBVsGMXwa3Mg4Nh5L0RDSPufbjsYVsO3nQ",
  authDomain: "chat-app-538f9.firebaseapp.com",
  projectId: "chat-app-538f9",
  storageBucket: "chat-app-538f9.firebasestorage.app",
  messagingSenderId: "747678706706",
  appId: "1:747678706706:web:d8eac0b87b03f018b23ccb"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
auth.settings = {
  ...auth.settings,
  timeout: 10000 // 10 seconds
};
export const db = getFirestore(app);
export const storage = getStorage(app);