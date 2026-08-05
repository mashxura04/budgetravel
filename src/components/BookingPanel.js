import { useState } from "react";
import { Check, Clock } from "lucide-react";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";
import TelegramButton from "./TelegramButton";

const STATUS_LABEL = {
  pending: "Request pending",
  confirmed: "Booking confirmed",
  declined: "Request declined",
};

function BookingPanel({
  price,
  priceLabel,
  rating,
  reviewCount,
  ctaLabel = "Request to book",
  listingType,
  listingId,
  listingTitle,
  existingBooking,
  onBooked,
  telegram,
  hostName,
}) {
  const { user } = useAuth();
  const [dates, setDates] = useState({ checkIn: "", checkOut: "" });
  const [guests, setGuests] = useState(1);
  const [contact, setContact] = useState({
    name: "",
    email: user?.email || "",
    phone: "",
  });
  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const firstName = hostName ? hostName.split(" ")[0] : "the host";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    const { data, error } = await supabase
      .from("booking_requests")
      .insert({
        listing_type: listingType,
        listing_id: listingId,
        listing_title: listingTitle,
        guest_name: contact.name,
        guest_email: contact.email,
        guest_phone: contact.phone || null,
        check_in: dates.checkIn || null,
        check_out: dates.checkOut || null,
        guests,
        user_id: user?.id || null,
      })
      .select()
      .single();

    if (error) {
      setStatus("error");
      setErrorMsg(`${error.message || "Unknown error"}${error.hint ? " — " + error.hint : ""}`);
      console.error(error);
      return;
    }

    setStatus("confirmed");
    if (user && onBooked) onBooked(data);
  };

  if (existingBooking && status === "idle") {
    return (
      <div className="sticky top-24 rounded-2xl border border-black/10 shadow-soft p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-4">
          <Clock size={22} className="text-amber-600" />
        </div>
        <h3 className="font-display text-lg font-semibold text-ink mb-1">
          {STATUS_LABEL[existingBooking.status] || "Request sent"}
        </h3>
        <p className="text-sm text-ink-muted mb-4">
          You already requested this on{" "}
          {new Date(existingBooking.created_at).toLocaleDateString()}.
        </p>
        <TelegramButton telegram={telegram} name={firstName} className="w-full mb-3" />
        <a href="/bookings" className="text-sm text-brand-600 font-semibold">
          View in My Bookings
        </a>
      </div>
    );
  }

  if (status === "confirmed") {
    return (
      <div className="sticky top-24 rounded-2xl border border-black/10 shadow-soft p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
          <Check size={22} className="text-green-600" />
        </div>
        <h3 className="font-display text-lg font-semibold text-ink mb-1">
          Request sent!
        </h3>
        <p className="text-sm text-ink-muted mb-4">
          Message {firstName} directly to confirm details and arrange payment.
        </p>
        <TelegramButton telegram={telegram} name={firstName} className="w-full mb-3" />
        {user && (
          <p className="text-xs text-ink-muted">
            You can track this in{" "}
            <a href="/bookings" className="text-brand-600 font-semibold">
              My Bookings
            </a>
          </p>
        )}
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky top-24 rounded-2xl border border-black/10 shadow-soft p-6"
    >
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <span className="text-2xl font-bold text-ink">${price}</span>
          <span className="text-ink-muted text-sm ml-1">{priceLabel}</span>
        </div>
        <span className="text-sm font-semibold text-ink flex items-center gap-1">
          ★ {rating} <span className="text-ink-muted font-normal">({reviewCount})</span>
        </span>
      </div>

      {priceLabel === "/ night" && (
        <div className="grid grid-cols-2 gap-2 mb-3">
          <label className="border border-black/10 rounded-xl p-2.5">
            <span className="block text-[10px] font-bold uppercase text-ink-muted">
              Check in
            </span>
            <input
              type="date"
              required
              value={dates.checkIn}
              onChange={(e) => setDates((d) => ({ ...d, checkIn: e.target.value }))}
              className="w-full text-sm focus:outline-none mt-0.5"
            />
          </label>
          <label className="border border-black/10 rounded-xl p-2.5">
            <span className="block text-[10px] font-bold uppercase text-ink-muted">
              Check out
            </span>
            <input
              type="date"
              required
              value={dates.checkOut}
              onChange={(e) => setDates((d) => ({ ...d, checkOut: e.target.value }))}
              className="w-full text-sm focus:outline-none mt-0.5"
            />
          </label>
        </div>
      )}

      <label className="block border border-black/10 rounded-xl p-2.5 mb-3">
        <span className="block text-[10px] font-bold uppercase text-ink-muted">Guests</span>
        <select
          value={guests}
          onChange={(e) => setGuests(Number(e.target.value))}
          className="w-full text-sm focus:outline-none mt-0.5 bg-transparent"
        >
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>
              {n} guest{n > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </label>

      <div className="space-y-2 mb-5">
        <input
          type="text"
          required
          placeholder="Your full name"
          value={contact.name}
          onChange={(e) => setContact((c) => ({ ...c, name: e.target.value }))}
          className="w-full border border-black/10 rounded-xl p-2.5 text-sm focus:outline-none focus:border-brand-400"
        />
        <input
          type="email"
          required
          placeholder="Email address"
          value={contact.email}
          onChange={(e) => setContact((c) => ({ ...c, email: e.target.value }))}
          className="w-full border border-black/10 rounded-xl p-2.5 text-sm focus:outline-none focus:border-brand-400"
        />
        <input
          type="tel"
          placeholder="Phone (optional)"
          value={contact.phone}
          onChange={(e) => setContact((c) => ({ ...c, phone: e.target.value }))}
          className="w-full border border-black/10 rounded-xl p-2.5 text-sm focus:outline-none focus:border-brand-400"
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600 text-center mb-3">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full py-3.5 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold shadow-brand-glow hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-60"
      >
        {status === "submitting" ? "Sending..." : ctaLabel}
      </button>

      <p className="text-xs text-ink-muted text-center mt-3">
        You won't be charged yet
      </p>
    </form>
  );
}

export default BookingPanel;