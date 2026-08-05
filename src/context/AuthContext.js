import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

const AuthContext = createContext(null);

const ADMIN_EMAIL = "mashhurakkk@gmail.com";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authModal, setAuthModal] = useState(null); // null | "signin" | "signup"

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) setAuthModal(null); // close modal on successful login
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const signUp = (email, password) => supabase.auth.signUp({ email, password });
  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password });
  const signOut = () => supabase.auth.signOut();
  const signInWithGoogle = () =>
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });

  const openSignIn = () => setAuthModal("signin");
  const openSignUp = () => setAuthModal("signup");
  const closeAuthModal = () => setAuthModal(null);

  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signUp,
        signIn,
        signOut,
        signInWithGoogle,
        authModal,
        openSignIn,
        openSignUp,
        closeAuthModal,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}