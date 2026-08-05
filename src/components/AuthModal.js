import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.1 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4c-7.7 0-14.3 4.4-17.7 10.7z"/>
      <path fill="#4CAF50" d="M24 44c5.4 0 10.3-2.1 14-5.5l-6.5-5.4c-2 1.4-4.6 2.3-7.5 2.3-5.2 0-9.6-3.3-11.3-7.9l-6.6 5.1C9.6 39.6 16.2 44 24 44z"/>
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4.1 5.6l6.5 5.4C41.5 36 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z"/>
    </svg>
  );
}

function AuthModal() {
  const {
    authModal,
    closeAuthModal,
    signIn,
    signUp,
    signInWithGoogle,
    openSignIn,
    openSignUp,
  } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const isSignUp = authModal === "signup";

  useEffect(() => {
    setEmail("");
    setPassword("");
    setError("");
    setNeedsConfirmation(false);
  }, [authModal]);

  if (!authModal) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isSignUp) {
      const { data, error } = await signUp(email, password);
      setLoading(false);
      if (error) return setError(error.message);
      if (!data.session) return setNeedsConfirmation(true);
    } else {
      const { error } = await signIn(email, password);
      setLoading(false);
      if (error) return setError(error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeAuthModal}
      />

      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-7 animate-fadeUp">
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 transition-colors"
        >
          <X size={18} />
        </button>

        {needsConfirmation ? (
          <div className="text-center py-6">
            <h2 className="font-display text-2xl font-semibold text-ink mb-2">
              Check your email
            </h2>
            <p className="text-ink-muted">
              We sent a confirmation link to <strong>{email}</strong>. Click it, then come
              back and log in.
            </p>
          </div>
        ) : (
          <>
            <h2 className="font-display text-2xl font-semibold text-ink text-center mb-1">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h2>
            <p className="text-ink-muted text-center text-sm mb-6">
              {isSignUp ? "Join budgetravel" : "Log in to your budgetravel account"}
            </p>

            <button
              type="button"
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-3 border border-black/15 rounded-full py-3 font-semibold text-sm text-ink hover:bg-neutral-50 transition-colors mb-4"
            >
              <GoogleIcon />
              Continue with Google
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="h-px bg-black/10 flex-1" />
              <span className="text-xs text-ink-muted">or</span>
              <div className="h-px bg-black/10 flex-1" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-black/10 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-400"
              />
              <input
                type="password"
                required
                minLength={isSignUp ? 6 : undefined}
                placeholder={isSignUp ? "Password (min. 6 characters)" : "Password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-black/10 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-400"
              />

              {error && <p className="text-sm text-red-600 text-center">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold shadow-brand-glow hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-60"
              >
                {loading ? "Please wait..." : isSignUp ? "Sign up" : "Log in"}
              </button>
            </form>

            <p className="text-center text-sm text-ink-muted mt-5">
              {isSignUp ? (
                <>
                  Already have an account?{" "}
                  <button onClick={openSignIn} className="text-brand-600 font-semibold">
                    Log in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{" "}
                  <button onClick={openSignUp} className="text-brand-600 font-semibold">
                    Sign up
                  </button>
                </>
              )}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthModal;