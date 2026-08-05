import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLanguage } from "../context/LanguageContext";

const LANGS = [
  { code: "en", label: "EN", flag: "🇬🇧" },
  { code: "ru", label: "RU", flag: "🇷🇺" },
  { code: "uz", label: "UZ", flag: "🇺🇿" },
];

function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const current = LANGS.find((l) => l.code === lang);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-black/10 hover:bg-neutral-50 transition-colors text-sm font-semibold"
      >
        <span>{current.flag}</span>
        <span className="text-ink-soft">{current.label}</span>
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-0 mt-2 w-32 bg-white border border-black/8 rounded-xl shadow-soft overflow-hidden z-50"
            >
              {LANGS.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLang(l.code);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-left transition-colors ${
                    lang === l.code ? "bg-brand-50 text-brand-700" : "text-ink-soft hover:bg-neutral-50"
                  }`}
                >
                  <span>{l.flag}</span>
                  <span>{l.label}</span>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LanguageSwitcher;