import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC4_V8ZL6eoAIFuKpsv5iG06GhVbaUNe1M",
  authDomain: "myfigure-7cb62.firebaseapp.com",
  projectId: "myfigure-7cb62",
  storageBucket: "myfigure-7cb62.firebasestorage.app",
  messagingSenderId: "7259505533",
  appId: "1:7259505533:web:963379b952eb0804fe0214"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
