import { Search, MapPin } from "lucide-react";

function SearchBar({ value, onChange, placeholder = "Search by name or city..." }) {
  return (
    <div className="flex items-center gap-1 bg-white rounded-full shadow-soft border border-black/5 p-2 max-w-xl w-full mx-auto">
      <div className="flex items-center gap-2 flex-1 pl-4">
        <MapPin size={18} className="text-ink-muted shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none bg-transparent"
        />
      </div>
      <button
        type="button"
        className="shrink-0 w-11 h-11 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center shadow-brand-glow hover:brightness-105 active:scale-95 transition-all"
        aria-label="Search"
      >
        <Search size={17} strokeWidth={2.5} />
      </button>
    </div>
  );
}

export default SearchBar;