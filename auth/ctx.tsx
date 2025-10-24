import { use, createContext, type PropsWithChildren, useEffect, useState } from "react";
import { useStorageState } from "./useStorageState";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from "firebase/auth";
import { useNotification } from "@/components/NotificationContext";
import { router } from "expo-router";

const AuthContext = createContext<{
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  session?: string | null;
  user?: User | null;
  isLoading: boolean;
}>({
  register: async () => {},
  login: async () => {},
  logout: async () => {},
  session: null,
  user: null,
  isLoading: false,
});

// Helper function to redirect to home page
const redirectToHome = () => {
  router.replace('/(tabs)');
};

// Use this hook to access the user info.
export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const [user, setUser] = useState<User | null>(null);
  const { showNotification } = useNotification();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setSession(token);
        setUser(user);
        console.log('🔐 [AuthContext] User logged in:', {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL
        });
      } else {
        setSession(null);
        setUser(null);
        console.log('🔐 [AuthContext] User logged out');
      }
    });
    return unsubscribe;
  }, []);

  const getFirebaseErrorMessage = (error: any): string => {
    switch (error.code) {
      case 'auth/email-already-in-use':
        return 'This email is already registered. Please try logging in instead.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters long.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/user-not-found':
        return 'No account found with this email address.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please check your credentials.';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection.';
      default:
        return error.message || 'An unexpected error occurred. Please try again.';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        register: async (email, password) => {
          try {
            await createUserWithEmailAndPassword(auth, email, password);
            showNotification('Account created successfully! Welcome to Lani Eats!', 'success');
            // Redirect to home page after successful registration
            setTimeout(() => {
              redirectToHome();
            }, 1000); // Small delay to show the success notification
          } catch (error: unknown) {
            const errorMessage = getFirebaseErrorMessage(error);
            showNotification(errorMessage, 'error');
            throw error;
          }
        },
        login: async (email, password) => {
          try {
            await signInWithEmailAndPassword(auth, email, password);
            showNotification('Welcome back! You have successfully logged in.', 'success');
            // Redirect to home page after successful login
            setTimeout(() => {
              redirectToHome();
            }, 1000); // Small delay to show the success notification
          } catch (error: unknown) {
            const errorMessage = getFirebaseErrorMessage(error);
            showNotification(errorMessage, 'error');
            throw error;
          }
        },
        logout: async () => {
          try {
            await signOut(auth);
            showNotification('You have been logged out successfully.', 'info');
          } catch (error: unknown) {
            const errorMessage = getFirebaseErrorMessage(error);
            showNotification(errorMessage, 'error');
            throw error;
          }
        },
        session,
        user,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
