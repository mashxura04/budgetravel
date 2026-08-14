import { useState } from "react";
import { Sparkles, Send } from "lucide-react";
import { supabase } from "../supabaseClient";

export default function AIAssistant({ category }) {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState(null);
  const [suggested, setSuggested] = useState([]);

  const ask = async () => {
    if (!message.trim()) return;
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("ai-assistant", {
      body: { category, message },
    });
    if (!error && data) {
      setReply(data.reply);
      setSuggested(data.suggested || []);
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#FFF3E2] rounded-2xl p-5 mb-8 border border-[#D9731A]/15">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={18} className="text-[#D9731A]" />
        <span className="font-semibold text-sm">Ask for a suggestion</span>
      </div>
      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && ask()}
          placeholder="e.g. Something cheap near the old town for 2 people"
          className="flex-1 border rounded-full px-4 py-2 text-sm bg-white"
        />
        <button
          onClick={ask}
          disabled={loading}
          className="bg-[#D9731A] text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-1 shrink-0"
        >
          {loading ? "..." : <Send size={14} />}
        </button>
      </div>

      {reply && (
        <div className="mt-4 text-sm text-ink-soft">
          <p className="mb-3">{reply}</p>
          {suggested.map((l) => (
            <a
              key={l.id}
              href={"/" + category + "/" + l.id}
              className="block bg-white rounded-lg p-3 mb-2 border hover:shadow-sm transition-shadow"
            >
              <p className="font-medium text-sm">{l.name}</p>
              <p className="text-xs text-gray-500">
                {l.city} - {l.price_label}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}