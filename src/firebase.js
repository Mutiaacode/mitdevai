// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCZQ1Vz70-ix-VcuV14B54E4r5L-VYW8xc",
  authDomain: "mitdev-ai.firebaseapp.com",
  projectId: "mitdev-ai",
  storageBucket: "mitdev-ai.appspot.com",
  messagingSenderId: "403744643113",
  appId: "1:403744643113:web:78a8f1c8d0b0fa20656438",
  measurementId: "G-RR8ZL5M2N5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

const logout = () => {
  return signOut(auth);
};

export { auth, signInWithGoogle, logout };
