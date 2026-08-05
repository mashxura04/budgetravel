import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

function FAQItem({ q, a, isOpen, onToggle }) {
  return (
    <div className="border border-black/8 rounded-2xl overflow-hidden bg-white">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 text-left px-5 py-4"
      >
        <span className="font-semibold text-ink text-sm">{q}</span>
        <ChevronDown
          size={18}
          className={`text-brand-600 shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="px-5 pb-4 text-sm text-ink-muted leading-relaxed">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function FAQSection() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState(null);

  const FAQS = [
    { q: t("faq1Q"), a: t("faq1A") },
    { q: t("faq2Q"), a: t("faq2A") },
    { q: t("faq3Q"), a: t("faq3A") },
    { q: t("faq4Q"), a: t("faq4A") },
  ];

  return (
    <section className="max-w-2xl mx-auto px-6 py-16">
      <div className="text-center mb-8">
        <p className="text-brand-600 font-bold text-xs tracking-[0.15em] uppercase mb-3">
          {t("faqEyebrow")}
        </p>
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink">
          {t("faqTitle")}
        </h2>
      </div>

      <div className="space-y-2.5">
        {FAQS.map((faq, i) => (
          <FAQItem
            key={faq.q}
            q={faq.q}
            a={faq.a}
            isOpen={openIndex === i}
            onToggle={() => setOpenIndex(openIndex === i ? null : i)}
          />
        ))}
      </div>
    </section>
  );
}

export default FAQSection;