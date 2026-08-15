import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Send, Star } from "lucide-react";
import { supabase } from "../supabaseClient";

const QUICK_PROMPTS = [
  "Cheap for 2 people",
  "Family friendly",
  "Near the old town",
  "Best rated",
];

export default function AIAssistant({ category }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState(null);
  const [suggested, setSuggested] = useState([]);

  const ask = async (overrideMessage) => {
    const text = overrideMessage || message;
    if (!text.trim()) return;
    setMessage(text);
    setLoading(true);
    setReply(null);
    const { data, error } = await supabase.functions.invoke("ai-assistant", {
      body: { category, message: text },
    });
    if (!error && data) {
      setReply(data.reply);
      setSuggested(data.suggested || []);
    }
    setLoading(false);
  };

  return (
    <div className="relative rounded-3xl p-6 mb-8 bg-gradient-to-br from-[#FFF3E2] to-[#FFE9CC] border border-[#D9731A]/15 shadow-[0_2px_12px_rgba(217,115,26,0.08)]">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shadow-brand-glow shrink-0">
          <Sparkles size={18} className="text-white" />
        </div>
        <div>
          <p className="font-display font-semibold text-ink text-[15px]">
            Ask for a suggestion
          </p>
          <p className="text-xs text-ink-muted">
            Tell us what you are looking for, we will find real matches
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask()}
          placeholder="e.g. Something cheap near the old town for 2 people"
          className="flex-1 border border-black/[0.08] rounded-full px-5 py-3 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 transition-shadow"
        />
        <button
          onClick={() => ask()}
          disabled={loading}
          className="bg-gradient-to-br from-brand-500 to-brand-600 text-white w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-brand-glow hover:brightness-105 transition-all disabled:opacity-60"
        >
          {loading ? (
            <span className="flex gap-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-bounce" />
            </span>
          ) : (
            <Send size={16} />
          )}
        </button>
      </div>

      {!reply && !loading && (
        <div className="flex flex-wrap gap-2 mt-4">
          {QUICK_PROMPTS.map((p) => (
            <button
              key={p}
              onClick={() => ask(p)}
              className="text-xs font-medium px-3 py-1.5 rounded-full bg-white/70 border border-black/[0.06] text-ink-soft hover:bg-white hover:border-brand-500/30 transition-colors"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {reply && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
            className="mt-5"
          >
            <div className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles size={13} className="text-white" />
              </div>
              <div className="bg-white rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-ink-soft shadow-sm max-w-xl">
                {reply}
              </div>
            </div>

            {suggested.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 ml-10">
                {suggested.map((l) => (
                  <a
                    key={l.id}
                    href={"/" + category + "/" + l.id}
                    className="flex gap-3 bg-white rounded-xl p-2.5 border border-black/[0.06] hover:shadow-card hover:-translate-y-0.5 transition-all"
                  >
                    {l.image && (
                      <img
                        src={l.image}
                        alt={l.name}
                        className="w-16 h-16 rounded-lg object-cover shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="font-medium text-sm text-ink truncate">
                        {l.name}
                      </p>
                      <p className="text-xs text-ink-muted">{l.city}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {l.rating && (
                          <span className="flex items-center gap-0.5 text-xs text-ink-soft">
                            <Star size={11} className="fill-brand-500 text-brand-500" />
                            {l.rating}
                          </span>
                        )}
                        <span className="text-xs font-medium text-brand-600">
                          {l.price_label}
                        </span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}