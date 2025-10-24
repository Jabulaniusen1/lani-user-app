import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCqAKAzthfxkTxuzwhMU2LjUJRKn_MoDHY",
  authDomain: "my-client-projects-c311c.firebaseapp.com",
  projectId: "my-client-projects-c311c",
  storageBucket: "my-client-projects-c311c.firebasestorage.app",
  messagingSenderId: "819119575672",
  appId: "1:819119575672:web:f0895157cfc1874601d38d",
  measurementId: "G-1G93JJ0B76"
};
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
export { auth, db };
