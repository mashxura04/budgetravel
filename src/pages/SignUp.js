import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SignUp() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { data, error } = await signUp(email, password);
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    // If Supabase has "Confirm email" turned on, there's no active session yet
    if (!data.session) {
      setNeedsConfirmation(true);
      return;
    }

    navigate("/");
  };

  if (needsConfirmation) {
    return (
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink mb-2">
          Check your email
        </h1>
        <p className="text-ink-muted">
          We sent a confirmation link to <strong>{email}</strong>. Click it to activate
          your account, then come back and log in.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink text-center mb-1">
        Create your account
      </h1>
      <p className="text-ink-muted text-center mb-8">Join budgetravel</p>

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
          minLength={6}
          placeholder="Password (min. 6 characters)"
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
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p className="text-center text-sm text-ink-muted mt-6">
        Already have an account?{" "}
        <Link to="/signin" className="text-brand-600 font-semibold">
          Log in
        </Link>
      </p>
    </div>
  );
}

export default SignUp;