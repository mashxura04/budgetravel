import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

function CTABanner() {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <section className="relative bg-[#FFF6EC] py-20 px-6 overflow-hidden">
      <div
        className="absolute inset-0 dot-grid opacity-40"
        style={{ maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 85%)" }}
      />

      {/* Little house illustration, left */}
      <svg
        className="absolute left-6 md:left-16 bottom-6 w-20 h-20 md:w-28 md:h-28 opacity-90"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path d="M50 15 L85 42 L85 82 C85 84 83 86 81 86 L60 86 L60 58 L40 58 L40 86 L19 86 C17 86 15 84 15 82 L15 42 Z" fill="#FFCC94" />
        <rect x="43" y="66" width="14" height="20" rx="1.5" fill="#E35F00" />
      </svg>

      {/* Little plant, right */}
      <svg
        className="absolute right-6 md:right-16 bottom-6 w-16 h-16 md:w-24 md:h-24 opacity-90"
        viewBox="0 0 100 100"
        fill="none"
      >
        <path d="M50 90 L50 45" stroke="#1D9E75" strokeWidth="4" strokeLinecap="round" />
        <path d="M50 55 C35 55 28 42 30 28 C44 30 52 40 50 55Z" fill="#5DCAA5" />
        <path d="M50 65 C65 65 72 52 70 38 C56 40 48 50 50 65Z" fill="#1D9E75" />
        <ellipse cx="50" cy="92" rx="22" ry="5" fill="#FFCC94" />
      </svg>

      {/* Sun accent, top */}
      <div
        className="absolute top-8 left-1/2 -translate-x-1/2 w-16 h-16 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,122,26,0.4) 0%, rgba(255,122,26,0) 70%)",
          filter: "blur(10px)",
        }}
      />

      <div className="max-w-2xl mx-auto text-center relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5 }}
          className="font-display text-3xl md:text-4xl font-semibold text-ink mb-4"
        >
          Ready for the real Uzbekistan?
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-ink-muted mb-8"
        >
          No middlemen, no tourist markup — just real families, real makers, and real food.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex items-center justify-center gap-3 flex-wrap"
        >
          <button
            onClick={() => navigate("/homes")}
            className="flex items-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold text-sm shadow-brand-glow hover:brightness-105 active:scale-[0.98] transition-all"
          >
            {t("navHomes")} <ArrowRight size={16} />
          </button>
          <button
            onClick={() => navigate("/become-host")}
            className="px-7 py-3.5 rounded-full border border-black/10 bg-white text-ink font-semibold text-sm hover:shadow-card transition-all"
          >
            {t("becomeHost")}
          </button>
        </motion.div>
      </div>
    </section>
  );
}

export default CTABanner;