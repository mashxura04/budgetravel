import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Clock } from "lucide-react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-green-50 text-green-700",
  declined: "bg-red-50 text-red-700",
};

function MyBookings() {
  const { user, loading: authLoading, openSignIn } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    supabase
      .from("booking_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!error) setBookings(data || []);
        setLoading(false);
      });
  }, [user]);

  if (authLoading || loading) {
    return <div className="max-w-3xl mx-auto px-6 py-20 text-center text-ink-muted">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink mb-2">
          Log in to see your bookings
        </h1>
        <p className="text-ink-muted mb-6">
          Your booking history is tied to your account.
        </p>
        <button
          onClick={openSignIn}
          className="px-6 py-3 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold shadow-brand-glow"
        >
          Log in
        </button>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="max-w-md mx-auto px-6 py-20 text-center">
        <h1 className="font-display text-2xl font-semibold text-ink mb-2">
          No bookings yet
        </h1>
        <p className="text-ink-muted mb-6">
          Once you request a homestay, craft, or table, it'll show up here.
        </p>
        <button
          onClick={() => navigate("/homes")}
          className="px-6 py-3 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold shadow-brand-glow"
        >
          Start browsing
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-semibold text-ink mb-8">My Bookings</h1>

      <div className="space-y-4">
        {bookings.map((b) => (
          <div key={b.id} className="border border-black/10 rounded-2xl p-5">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-semibold text-ink">{b.listing_title}</h3>
              <span
                className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[b.status] || "bg-neutral-100 text-ink-muted"}`}
              >
                {b.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
              <span className="flex items-center gap-1 capitalize">
                <MapPin size={13} /> {b.listing_type}
              </span>
              {b.check_in && (
                <span className="flex items-center gap-1">
                  <Calendar size={13} /> {b.check_in} → {b.check_out}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Clock size={13} /> {new Date(b.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyBookings;