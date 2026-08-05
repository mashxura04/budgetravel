import { motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

function HowItWorks() {
  const { t } = useLanguage();

  const STEPS = [
    { num: "01", title: t("step1Title"), body: t("step1Body") },
    { num: "02", title: t("step2Title"), body: t("step2Body") },
    { num: "03", title: t("step3Title"), body: t("step3Body") },
    { num: "04", title: t("step4Title"), body: t("step4Body"), highlight: true },
  ];

  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <div className="text-center mb-10">
        <p className="text-brand-600 font-bold text-xs tracking-[0.15em] uppercase mb-3">
          {t("howItWorksEyebrow")}
        </p>
        <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink">
          {t("howItWorksTitle")}
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {STEPS.map((step, i) => (
          <motion.div
            key={step.num}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
            className={`rounded-2xl p-5 border transition-shadow hover:shadow-card ${
              step.highlight
                ? "bg-brand-50 border-brand-200"
                : "bg-neutral-50 border-neutral-100"
            }`}
          >
            <span
              className={`font-display text-3xl font-bold ${
                step.highlight ? "text-brand-500" : "text-brand-200"
              }`}
            >
              {step.num}
            </span>
            <h3 className="font-bold text-ink text-[15px] mt-2 mb-1.5">{step.title}</h3>
            <p className="text-sm text-ink-muted leading-snug">{step.body}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default HowItWorks;