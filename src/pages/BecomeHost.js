import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Clock } from "lucide-react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

const LISTING_TYPES = [
  { value: "home", label: "Homestay" },
  { value: "craft", label: "Craft / Handmade goods" },
  { value: "cafe", label: "Cafe / Restaurant" },
];

const STATUS_LABEL = {
  new: "Application received",
  contacted: "We've reached out to you",
  approved: "You're approved!",
  rejected: "Application not approved",
};

function BecomeHost() {
  const navigate = useNavigate();
  const { user, loading: authLoading, openSignIn } = useAuth();
  const [existingApplication, setExistingApplication] = useState(undefined);
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    telegram: "",
    city: "",
    listingType: "home",
    description: "",
  });
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!user) {
      setExistingApplication(null);
      return;
    }

    supabase
      .from("host_applications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        setExistingApplication(data && data.length > 0 ? data[0] : null);
      });
  }, [user]);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const { data, error } = await supabase
      .from("host_applications")
      .insert({
        user_id: user.id,
        full_name: form.fullName,
        email: user.email,
        phone: form.phone || null,
        telegram: form.telegram || null,
        city: form.city,
        listing_type: form.listingType,
        description: form.description,
      })
      .select()
      .single();

    if (error) {
      setStatus("error");
      setErrorMsg(`${error.message}${error.hint ? " — " + error.hint : ""}`);
      console.error(error);
      return;
    }

    setStatus("confirmed");
    setExistingApplication(data);
  };

  if (authLoading || existingApplication === undefined) {
    return <div className="max-w-md mx-auto px-6 py-24 text-center text-ink-muted">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink mb-2">
          Log in to apply
        </h1>
        <p className="text-ink-muted mb-6">
          Creating an account lets us keep you updated on your application and lets
          you track its status anytime.
        </p>
        <button
          onClick={openSignIn}
          className="px-6 py-3 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold shadow-brand-glow"
        >
          Log in / Sign up
        </button>
      </div>
    );
  }

  // Already applied — show status instead of letting them apply again,
  // unless their last application was rejected (then let them try again)
  if (existingApplication && existingApplication.status !== "rejected") {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-5">
          <Clock size={26} className="text-amber-600" />
        </div>
        <h1 className="font-display text-2xl font-semibold text-ink mb-2">
          {STATUS_LABEL[existingApplication.status] || "Application pending"}
        </h1>
        <p className="text-ink-muted mb-6">
          You applied on {new Date(existingApplication.created_at).toLocaleDateString()}{" "}
          as a {existingApplication.listing_type}. We review every application
          personally — check back here for updates.
        </p>
        <button
          onClick={() => navigate("/activity")}
          className="px-6 py-3 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold shadow-brand-glow"
        >
          View in My Activity
        </button>
      </div>
    );
  }

  if (status === "confirmed") {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center">
        <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-5">
          <Check size={26} className="text-green-600" />
        </div>
        <h1 className="font-display text-2xl font-semibold text-ink mb-2">
          Application received!
        </h1>
        <p className="text-ink-muted mb-6">
          We review every application personally. If it's a good fit, we'll reach out
          within a few days to get you listed.
        </p>
        <button
          onClick={() => navigate("/activity")}
          className="px-6 py-3 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold shadow-brand-glow"
        >
          View my application
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-14">
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl md:text-4xl font-semibold text-ink mb-3">
          Become a host
        </h1>
        <p className="text-ink-muted">
          Share your home, your craft, or your kitchen with travelers looking for the
          real Uzbekistan — not the tourist version.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">
            What would you like to offer?
          </label>
          <div className="grid grid-cols-3 gap-2">
            {LISTING_TYPES.map((t) => (
              <button
                key={t.value}
                type="button"
                onClick={() => setForm((f) => ({ ...f, listingType: t.value }))}
                className={`py-3 px-2 rounded-xl text-sm font-semibold border transition-all ${
                  form.listingType === t.value
                    ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white border-transparent shadow-brand-glow"
                    : "border-black/10 text-ink-soft hover:border-black/25"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <input
          type="text"
          required
          placeholder="Full name"
          value={form.fullName}
          onChange={update("fullName")}
          className="w-full border border-black/10 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-400"
        />

        <input
          type="text"
          required
          placeholder="City"
          value={form.city}
          onChange={update("city")}
          className="w-full border border-black/10 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-400"
        />

        <div className="grid grid-cols-2 gap-3">
          <input
            type="tel"
            placeholder="Phone (optional)"
            value={form.phone}
            onChange={update("phone")}
            className="w-full border border-black/10 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-400"
          />
          <input
            type="text"
            placeholder="Telegram username (optional)"
            value={form.telegram}
            onChange={update("telegram")}
            className="w-full border border-black/10 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-400"
          />
        </div>

        <textarea
          required
          rows={4}
          placeholder="Tell us about your home, craft, or cafe — what makes it special?"
          value={form.description}
          onChange={update("description")}
          className="w-full border border-black/10 rounded-xl p-3 text-sm focus:outline-none focus:border-brand-400 resize-none"
        />

        {status === "error" && (
          <p className="text-sm text-red-600 text-center">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full py-3.5 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold shadow-brand-glow hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-60"
        >
          {status === "submitting" ? "Submitting..." : "Submit application"}
        </button>
      </form>
    </div>
  );
}

export default BecomeHost;