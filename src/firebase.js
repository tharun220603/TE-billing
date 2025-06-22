
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBy6IERqLexFqG13d6AXc_AgHl1iaTCqWU",
  authDomain: "te--billing.firebaseapp.com",
  projectId: "te--billing",
  storageBucket: "te--billing.firebasestorage.app",
  messagingSenderId: "854966706948",
  appId: "1:854966706948:web:469601b9f0130d2e902651",
  measurementId: "G-9THBZMNP28"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);
export const auth = getAuth(app); 