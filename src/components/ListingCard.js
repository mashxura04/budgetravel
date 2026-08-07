import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Heart, MapPin } from "lucide-react";

function ListingCard({ image, title, city, address, rating, reviewCount, price, priceLabel, to }) {
  const [saved, setSaved] = useState(false);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
      className="group"
    >
      <Link to={to} className="block cursor-pointer">
        <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-neutral-100 shadow-card group-hover:shadow-card-hover transition-shadow duration-300">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSaved((prev) => !prev);
            }}
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            aria-label={saved ? "Remove from saved" : "Save to wishlist"}
          >
            <Heart
              size={22}
              strokeWidth={1.8}
              className="drop-shadow-sm"
              fill={saved ? "#FF7A1A" : "rgba(0,0,0,0.35)"}
              color="white"
            />
          </button>

          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-semibold text-ink">
            <MapPin size={11} />
            {city}
          </div>
        </div>

        <div className="pt-3.5 px-0.5">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-semibold text-[16px] text-ink leading-snug line-clamp-1">
              {title}
            </h3>
            <div className="flex items-center gap-1 shrink-0 text-sm font-semibold text-ink">
              <Star size={13} fill="#FF7A1A" color="#FF7A1A" />
              {rating}
            </div>
          </div>

          <p className="text-sm text-ink-muted mt-0.5 line-clamp-1">{address}</p>

          <div className="flex items-baseline gap-1.5 mt-2.5">
            <span className="font-bold text-[15px] text-ink">${price}</span>
            <span className="text-sm text-ink-muted">{priceLabel}</span>
            <span className="text-xs text-ink-muted ml-1">({reviewCount})</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default ListingCard;