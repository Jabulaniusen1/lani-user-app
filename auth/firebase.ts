import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";

import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API,
  authDomain: "my-client-projects-c311c.firebaseapp.com",
  projectId: "my-client-projects-c311c",
  storageBucket: "my-client-projects-c311c.firebasestorage.app",
  messagingSenderId: "819119575672",
  appId: "1:819119575672:web:f0895157cfc1874601d38d",
  measurementId: "G-1G93JJ0B76",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export { auth };
