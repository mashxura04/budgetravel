import { Send } from "lucide-react";

function TelegramButton({ telegram, name, className = "" }) {
  if (!telegram) return null;

  return (

    <a
    
      href={`https://t.me/${telegram}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#229ED9] text-white font-semibold text-sm hover:brightness-105 active:scale-[0.98] transition-all ${className}`}
    >
      <Send size={16} />
      Message {name} on Telegram
    </a>
  );
}

export default TelegramButton;