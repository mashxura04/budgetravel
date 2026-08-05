import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, MapPin } from "lucide-react";
import CountUp from "./CountUp";
import { useLanguage } from "../context/LanguageContext";

function Hero({ homesCount = 0, craftsCount = 0, cafesCount = 0 }) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/homes${query ? `?q=${encodeURIComponent(query)}` : ""}`);
  };

  return (
    <section className="relative bg-gradient-to-b from-[#FFFBF7] via-[#FFF6EC] to-[#FFEEDC] pt-16 pb-20 px-6 overflow-hidden">
      <div
        className="absolute -top-16 -left-10 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,122,26,0.35) 0%, rgba(255,122,26,0) 70%)",
          filter: "blur(30px)",
        }}
      />
      <div
        className="absolute top-4 -right-16 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,122,26,0.25) 0%, rgba(255,122,26,0) 70%)",
          filter: "blur(36px)",
        }}
      />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-brand-600 font-bold text-sm tracking-widest uppercase mb-4"
        >
          {t("heroEyebrow")}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-display text-5xl md:text-6xl font-semibold text-ink leading-[1.08] tracking-tight"
        >
          {t("heroTitle1")}
          <br />
          {t("heroTitle2")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-5 text-lg text-ink-muted max-w-xl mx-auto"
        >
          {t("heroSubtitle")}
        </motion.p>

        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-9 flex items-center gap-1 bg-white rounded-full shadow-soft border border-black/5 p-2 max-w-lg mx-auto"
        >
          <div className="flex items-center gap-2 flex-1 pl-4">
            <MapPin size={18} className="text-ink-muted shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="w-full py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none bg-transparent"
            />
          </div>
          <button
            type="submit"
            className="shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center shadow-brand-glow hover:brightness-105 active:scale-95 transition-all"
            aria-label="Search"
          >
            <Search size={17} strokeWidth={2.5} />
          </button>
        </motion.form>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 inline-flex items-center gap-4 bg-white/70 backdrop-blur-sm px-6 py-3 rounded-full border border-brand-200 shadow-soft text-sm text-ink-soft"
        >
          <span>
            <strong className="text-brand-600 text-base">
              <CountUp end={homesCount} />
            </strong>{" "}
            {t("statHomestays")}
          </span>
          <span className="w-1 h-1 rounded-full bg-ink-muted/40" />
          <span>
            <strong className="text-brand-600 text-base">
              <CountUp end={craftsCount} />
            </strong>{" "}
            {t("statCrafts")}
          </span>
          <span className="w-1 h-1 rounded-full bg-ink-muted/40" />
          <span>
            <strong className="text-brand-600 text-base">
              <CountUp end={cafesCount} />
            </strong>{" "}
            {t("statCafes")}
          </span>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero;