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

function Homes() {
  const { t, lang } = useLanguage();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeCity, setActiveCity] = useState("All");
  const [homes, setHomes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("listings")
      .select("*")
      .eq("type", "home")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setHomes(data || []);
        setLoading(false);
      });
  }, []);

  const localized = useMemo(() => homes.map((h) => localizeListing(h, lang)), [homes, lang]);
  const cities = useMemo(() => [...new Set(localized.map((h) => h.city))], [localized]);

  const filtered = useMemo(() => {
    return localized.filter((home) => {
      const matchesCity = activeCity === "All" || home.city === activeCity;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        home.name.toLowerCase().includes(q) ||
        home.city.toLowerCase().includes(q) ||
        home.address.toLowerCase().includes(q);
      return matchesCity && matchesQuery;
    });
  }, [localized, query, activeCity]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-6 py-24 text-center text-ink-muted">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <Helmet>
        <title>Homestays in Uzbekistan | budgetravel</title>
        <meta
          name="description"
          content="Browse real Uzbek homestays in Samarkand, Bukhara, Khiva, and Tashkent — booked directly with the host, no tourist markup."
        />
      </Helmet>

      <div className="text-center mb-8">
        <h1 className="font-display text-4xl font-semibold text-ink">{t("homesTitle")}</h1>
        <p className="text-ink-muted mt-2">{t("homesSubtitle")}</p>
      </div>

      <AIAssistant category="homes" />

      <SearchBar value={query} onChange={setQuery} placeholder={t("searchByNameCity")} />

      <div className="mt-6 mb-8">
        <CategoryTabs options={cities} active={activeCity} onChange={setActiveCity} />
      </div>

      <p className="text-sm text-ink-muted mb-6">
        {t("showingHomes", { filtered: filtered.length, total: localized.length })}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-ink-muted">{t("noHomesMatch")}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-9">
          {filtered.map((home) => (
            <ListingCard
              key={home.id}
              image={home.image}
              title={home.name}
              city={home.city}
              address={home.address}
              rating={home.rating}
              reviewCount={home.review_count}
              price={home.price}
              priceLabel={home.price_label}
              to={`/homes/${home.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Homes;