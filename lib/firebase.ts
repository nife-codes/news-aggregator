import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxLM6UsPh9Z5MoRofc8bEKbtHkJeaJF9A",
  authDomain: "news-aggregator-a0342.firebaseapp.com",
  projectId: "news-aggregator-a0342",
  storageBucket: "news-aggregator-a0342.firebasestorage.app",
  messagingSenderId: "728449412137",
  appId: "1:728449412137:web:60d54f31668f5472140038"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export default app;