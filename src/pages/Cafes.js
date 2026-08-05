import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import SearchBar from "../components/SearchBar";
import CategoryTabs from "../components/CategoryTabs";
import ListingCard from "../components/ListingCard";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../supabaseClient";
import { localizeListing } from "../utils/localize";

function Cafes() {
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [activeCity, setActiveCity] = useState("All");
  const [cafes, setCafes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("listings")
      .select("*")
      .eq("type", "cafe")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setCafes(data || []);
        setLoading(false);
      });
  }, []);

  const localized = useMemo(() => cafes.map((c) => localizeListing(c, lang)), [cafes, lang]);
  const cities = useMemo(() => [...new Set(localized.map((c) => c.city))], [localized]);

  const filtered = useMemo(() => {
    return localized.filter((cafe) => {
      const matchesCity = activeCity === "All" || cafe.city === activeCity;
      const q = query.trim().toLowerCase();
      const matchesQuery =
        !q ||
        cafe.name.toLowerCase().includes(q) ||
        cafe.city.toLowerCase().includes(q) ||
        cafe.address.toLowerCase().includes(q);
      return matchesCity && matchesQuery;
    });
  }, [localized, query, activeCity]);

  if (loading) {
    return <div className="max-w-7xl mx-auto px-6 py-24 text-center text-ink-muted">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <Helmet>
        <title>Local Cafes & Restaurants in Uzbekistan | budgetravel</title>
        <meta
          name="description"
          content="Find family-run cafes and restaurants across Uzbekistan where locals actually eat — not tourist-priced spots."
        />
      </Helmet>

      <div className="text-center mb-8">
        <h1 className="font-display text-4xl font-semibold text-ink">{t("cafesTitle")}</h1>
        <p className="text-ink-muted mt-2">{t("cafesSubtitle")}</p>
      </div>

      <SearchBar value={query} onChange={setQuery} placeholder={t("searchByNameCity")} />

      <div className="mt-6 mb-8">
        <CategoryTabs options={cities} active={activeCity} onChange={setActiveCity} />
      </div>

      <p className="text-sm text-ink-muted mb-6">
        {t("showingCafes", { filtered: filtered.length, total: localized.length })}
      </p>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-ink-muted">{t("noCafesMatch")}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-9">
          {filtered.map((cafe) => (
            <ListingCard
              key={cafe.id}
              image={cafe.image}
              title={cafe.name}
              city={cafe.city}
              address={cafe.address}
              rating={cafe.rating}
              reviewCount={cafe.review_count}
              price={cafe.price}
              priceLabel={cafe.price_label}
              onClick={() => navigate(`/cafes/${cafe.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Cafes;