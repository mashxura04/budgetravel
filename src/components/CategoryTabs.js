import { useLanguage } from "../context/LanguageContext";

function CategoryTabs({ options, active, onChange }) {
  const { t } = useLanguage();

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
      <button
        onClick={() => onChange("All")}
        className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
          active === "All"
            ? "bg-ink text-white border-ink"
            : "bg-white text-ink-soft border-black/10 hover:border-black/25"
        }`}
      >
        {t("filterAll")}
      </button>
      {options.map((city) => (
        <button
          key={city}
          onClick={() => onChange(city)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
            active === city
              ? "bg-ink text-white border-ink"
              : "bg-white text-ink-soft border-black/10 hover:border-black/25"
          }`}
        >
          {city}
        </button>
      ))}
    </div>
  );
}

export default CategoryTabs;