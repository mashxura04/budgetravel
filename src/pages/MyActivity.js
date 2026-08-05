import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, MapPin, Clock, Home } from "lucide-react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

const BOOKING_STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-green-50 text-green-700",
  declined: "bg-red-50 text-red-700",
};

const APPLICATION_STATUS_STYLES = {
  new: "bg-amber-50 text-amber-700",
  contacted: "bg-sky-50 text-sky-700",
  approved: "bg-green-50 text-green-700",
  rejected: "bg-red-50 text-red-700",
};

function EmptyState({ title, body, ctaLabel, ctaPath }) {
  const navigate = useNavigate();
  return (
    <div className="text-center py-16">
      <h2 className="font-display text-xl font-semibold text-ink mb-2">{title}</h2>
      <p className="text-ink-muted mb-6">{body}</p>
      <button
        onClick={() => navigate(ctaPath)}
        className="px-6 py-3 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold shadow-brand-glow"
      >
        {ctaLabel}
      </button>
    </div>
  );
}

function MyActivity() {
  const { user, loading: authLoading, openSignIn } = useAuth();
  const [tab, setTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    Promise.all([
      supabase
        .from("booking_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("host_applications")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]).then(([bookingsRes, applicationsRes]) => {
      setBookings(bookingsRes.data || []);
      setApplications(applicationsRes.data || []);
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
          Log in to see your activity
        </h1>
        <p className="text-ink-muted mb-6">
          Your bookings and host applications are tied to your account.
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

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-semibold text-ink mb-6">My Activity</h1>

      <div className="flex items-center gap-2 bg-neutral-50 rounded-full p-1.5 border border-black/5 w-fit mb-8">
        <button
          onClick={() => setTab("bookings")}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
            tab === "bookings"
              ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-brand-glow"
              : "text-ink-soft"
          }`}
        >
          Bookings ({bookings.length})
        </button>
        <button
          onClick={() => setTab("applications")}
          className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
            tab === "applications"
              ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-brand-glow"
              : "text-ink-soft"
          }`}
        >
          Host Applications ({applications.length})
        </button>
      </div>

      {tab === "bookings" && (
        bookings.length === 0 ? (
          <EmptyState
            title="No bookings yet"
            body="Once you request a homestay, craft, or table, it'll show up here."
            ctaLabel="Start browsing"
            ctaPath="/homes"
          />
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div key={b.id} className="border border-black/10 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-ink">{b.listing_title}</h3>
                  <span
                    className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full capitalize ${BOOKING_STATUS_STYLES[b.status] || "bg-neutral-100 text-ink-muted"}`}
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
        )
      )}

      {tab === "applications" && (
        applications.length === 0 ? (
          <EmptyState
            title="No host applications yet"
            body="Applied to list your home, craft, or cafe? It'll show up here."
            ctaLabel="Become a host"
            ctaPath="/become-host"
          />
        ) : (
          <div className="space-y-4">
            {applications.map((a) => (
              <div key={a.id} className="border border-black/10 rounded-2xl p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="font-semibold text-ink capitalize">
                    {a.listing_type} in {a.city}
                  </h3>
                  <span
                    className={`shrink-0 text-xs font-bold px-2.5 py-1 rounded-full capitalize ${APPLICATION_STATUS_STYLES[a.status] || "bg-neutral-100 text-ink-muted"}`}
                  >
                    {a.status}
                  </span>
                </div>
                <p className="text-sm text-ink-soft mb-2 line-clamp-2">{a.description}</p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-ink-muted">
                  <span className="flex items-center gap-1">
                    <Home size={13} /> {a.full_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={13} /> {new Date(a.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}

export default MyActivity;