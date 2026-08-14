import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SearchBar from "../components/SearchBar";
import CategoryTabs from "../components/CategoryTabs";
import ListingCard from "../components/ListingCard";
import AIAssistant from "../components/AIAssistant";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../supabaseClient";
import { localizeListing } from "../utils/localize";

function Crafts() {
  const { t, lang } = useLanguage();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeCity, setActiveCity] = useState("All");
  const [crafts, setCrafts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("listings")
      .select("*")
      .eq("type", "craft")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setCrafts(data || []);
        setLoading(false);
      });
  }, []);

  const localized = useMemo(() => crafts.map((c) => localizeListing(c, lang)), [crafts, lang]);
  const cities = useMemo(() => [...new Set(localized.map((c) => c.city))], [localized]);

  const filtered = useMemo(() => {
    return localized.filter((craft) => {
      const matchesCity = activeCity === "All" || craft.city === activeCity;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        craft.name.toLowerCase().includes(q) ||
        craft.city.toLowerCase().includes(q) ||
        craft.address.toLowerCase().includes(q);
      return matchesCity && matchesQuery;
    });
  }, [localized, query, activeCity]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-6 py-24 text-center text-ink-muted">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <Helmet>
        <title>Handmade Crafts from Uzbekistan | budgetravel</title>
        <meta
          name="description"
          content="Shop handmade suzani, ceramics, silk, and woodwork directly from Uzbek artisans — no middleman."
        />
      </Helmet>

      <div className="text-center mb-8">
        <h1 className="font-display text-4xl font-semibold text-ink">{t("craftsTitle")}</h1>
        <p className="text-ink-muted mt-2">{t("craftsSubtitle")}</p>
      </div>

      <AIAssistant category="crafts" />

      <SearchBar value={query} onChange={setQuery} placeholder={t("searchByNameCity")} />

      <div className="mt-6 mb-8">
        <CategoryTabs options={cities} active={activeCity} onChange={setActiveCity} />
      </div>

      <p className="text-sm text-ink-muted mb-6">
        {t("showingCrafts", { filtered: filtered.length, total: localized.length })}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-ink-muted">{t("noCraftsMatch")}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-9">
          {filtered.map((craft) => (
            <ListingCard
              key={craft.id}
              image={craft.image}
              title={craft.name}
              city={craft.city}
              address={craft.address}
              rating={craft.rating}
              reviewCount={craft.review_count}
              price={craft.price}
              priceLabel={craft.price_label}
              to={`/crafts/${craft.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Crafts;