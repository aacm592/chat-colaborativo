import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCDUpWdvC6aOHMqiocBefq7-RiaIJQzzmo",
  authDomain: "chat-colaborativo-3edcd.firebaseapp.com",
  projectId: "chat-colaborativo-3edcd",
  storageBucket: "chat-colaborativo-3edcd.firebasestorage.app",
  messagingSenderId: "373546534530",
  appId: "1:373546534530:web:e61944d0cc01115fc8169b"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();