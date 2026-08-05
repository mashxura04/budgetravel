import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, MapPin, Heart } from "lucide-react";
import BookingPanel from "./BookingPanel";
import TelegramButton from "./TelegramButton";
import { supabase } from "../supabaseClient";
import { useAuth } from "../context/AuthContext";

function ListingDetail({
  listingType,
  listingId,
  image,
  title,
  city,
  address,
  rating,
  reviewCount,
  price,
  priceLabel,
  description,
  personRole,
  personName,
  telegram,
  ctaLabel,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  const [existingBooking, setExistingBooking] = useState(undefined);

  useEffect(() => {
    if (!user) {
      setExistingBooking(null);
      return;
    }

    supabase
      .from("booking_requests")
      .select("*")
      .eq("user_id", user.id)
      .eq("listing_type", listingType)
      .eq("listing_id", listingId)
      .order("created_at", { ascending: false })
      .limit(1)
      .then(({ data }) => {
        setExistingBooking(data && data.length > 0 ? data[0] : null);
      });
  }, [user, listingType, listingId]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm font-semibold text-ink-soft hover:text-ink mb-6 transition-colors"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="flex items-start justify-between gap-4 mb-5">
        <h1 className="font-display text-4xl md:text-5xl font-semibold text-ink leading-tight tracking-tight">
          {title}
        </h1>
        <button
          onClick={() => setSaved((prev) => !prev)}
          className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full border border-black/10 hover:shadow-card transition-shadow"
        >
          <Heart size={16} fill={saved ? "#FF7A1A" : "none"} color={saved ? "#FF7A1A" : "#1C1C1E"} />
          <span className="text-sm font-semibold">{saved ? "Saved" : "Save"}</span>
        </button>
      </div>

      <div className="flex items-center gap-4 text-sm text-ink-soft mb-7">
        <span className="flex items-center gap-1 font-semibold text-ink">
          <Star size={14} fill="#FF7A1A" color="#FF7A1A" />
          {rating} · {reviewCount} reviews
        </span>
        <span className="w-1 h-1 rounded-full bg-ink-muted/40" />
        <span className="flex items-center gap-1">
          <MapPin size={14} /> {address}
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="rounded-[28px] overflow-hidden aspect-[16/9] mb-12 shadow-soft"
      >
        <img src={image} alt={title} className="w-full h-full object-cover" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="pb-7 mb-7 border-b border-black/8">
            <h2 className="font-display text-xl font-semibold text-ink mb-1">
              {personRole}: {personName}
            </h2>
            <p className="text-ink-muted text-sm mb-5">{city}, Uzbekistan</p>
            <TelegramButton telegram={telegram} name={personName.split(" ")[0]} />
          </div>

          <h3 className="font-semibold text-ink mb-3">
            About this {ctaLabel === "Request to book" ? "stay" : "listing"}
          </h3>
          <p className="text-ink-soft leading-relaxed">{description}</p>
        </div>

        <div className="lg:col-span-1">
          <BookingPanel
            listingType={listingType}
            listingId={listingId}
            listingTitle={title}
            price={price}
            priceLabel={priceLabel}
            rating={rating}
            reviewCount={reviewCount}
            ctaLabel={ctaLabel}
            existingBooking={existingBooking}
            onBooked={(newBooking) => setExistingBooking(newBooking)}
            telegram={telegram}
            hostName={personName}
          />
        </div>
      </div>
    </div>
  );
}

export default ListingDetail;