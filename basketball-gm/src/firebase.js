// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBOXTKS2-oLskTcbQvH1h7WhRjuOJXXcJ8",
  authDomain: "nba-copero.firebaseapp.com",
  projectId: "nba-copero",
  storageBucket: "nba-copero.firebasestorage.app",
  messagingSenderId: "253988140366",
  appId: "1:253988140366:web:15f6be307976dffe429a1f",
  measurementId: "G-KE36X21YBQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);