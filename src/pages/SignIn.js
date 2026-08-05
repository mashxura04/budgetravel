import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    navigate("/");
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <h1 className="font-display text-3xl font-semibold text-ink text-center mb-1">
        Welcome back
      </h1>
      <p className="text-ink-muted text-center mb-8">Log in to your budgetravel account</p>

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
          placeholder="Password"
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
          {loading ? "Logging in..." : "Log in"}
        </button>
      </form>

      <p className="text-center text-sm text-ink-muted mt-6">
        Don't have an account?{" "}
        <Link to="/signup" className="text-brand-600 font-semibold">
          Sign up
        </Link>
      </p>
    </div>
  );
}

export default SignIn;