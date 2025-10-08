import { use, createContext, type PropsWithChildren, useEffect } from "react";
import { useStorageState } from "./useStorageState";
import { auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { Alert } from "react-native";

const AuthContext = createContext<{
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  session?: string | null;
  isLoading: boolean;
}>({
  register: async () => {},
  login: async () => {},
  logout: async () => {},
  session: null,
  isLoading: false,
});

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const token = await user.getIdToken();
        setSession(token);
      } else {
        setSession(null);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider
      value={{
        register: async (email, password) => {
          try {
            await createUserWithEmailAndPassword(auth, email, password);
          } catch (error: unknown) {
            if (error instanceof Error) {
              Alert.alert("Error", "This email already exist", [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
              ]);
              
            } else {
              Alert.alert("Error", "Something went wrong", [
                {
                  text: "Cancel",
                  onPress: () => console.log("Cancel Pressed"),
                  style: "cancel",
                },
              ]);
              throw error;
            }
          }
        },
        login: async (email, password) => {
          try {
            await signInWithEmailAndPassword(auth, email, password);
          } catch (error: unknown) {
            Alert.alert("Error", "Something went wrong", [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
            ]);
          }
        },
        logout: async () => {
          try {
            await signOut(auth);
          } catch (error: unknown) {
            Alert.alert("Error", "Something went wrong", [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel",
              },
            ]);
          }
        },
        session,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
