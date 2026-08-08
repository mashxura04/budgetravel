import { motion } from "framer-motion";
import CountUp from "./CountUp";
import { useLanguage } from "../context/LanguageContext";

function Hero({ homesCount = 0, craftsCount = 0, cafesCount = 0 }) {
  const { t } = useLanguage();

  return (
    <section className="relative bg-white pt-24 pb-28 px-6 overflow-hidden">
      <div
        className="absolute inset-0 dot-grid opacity-40"
        style={{ maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black 30%, transparent 90%)" }}
      />
      <div
        className="absolute -top-16 -left-10 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,122,26,0.18) 0%, rgba(255,122,26,0) 70%)",
          filter: "blur(30px)",
        }}
      />
      <div
        className="absolute top-4 -right-16 w-80 h-80 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(255,122,26,0.14) 0%, rgba(255,122,26,0) 70%)",
          filter: "blur(36px)",
        }}
      />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-brand-600 font-bold text-sm tracking-[0.2em] uppercase mb-5"
        >
          {t("heroEyebrow")}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-display text-6xl md:text-7xl font-semibold text-ink leading-[1.05] tracking-tight"
        >
          {t("heroTitle1")}
          <br />
          {t("heroTitle2")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-6 text-lg text-ink-muted max-w-xl mx-auto"
        >
          {t("heroSubtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-10 inline-flex items-center gap-6 bg-white px-8 py-4 rounded-full border border-brand-200 shadow-soft text-base text-ink-soft"
        >
          <span>
            <strong className="text-brand-600 text-xl">
              <CountUp end={homesCount} />
            </strong>{" "}
            {t("statHomestays")}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-ink-muted/40" />
          <span>
            <strong className="text-brand-600 text-xl">
              <CountUp end={craftsCount} />
            </strong>{" "}
            {t("statCrafts")}
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-ink-muted/40" />
          <span>
            <strong className="text-brand-600 text-xl">
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