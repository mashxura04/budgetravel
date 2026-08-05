import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ArrowRight } from "lucide-react";
import Hero from "../components/Hero";
import JourneySection from "../components/JourneySection";
import HowItWorks from "../components/HowItWorks";
import FAQSection from "../components/FAQSection";
import ListingCard from "../components/ListingCard";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../supabaseClient";
import { localizeListing } from "../utils/localize";

function Section({ title, subtitle, items, seeAllPath }) {
  const navigate = useNavigate();

  return (
    <section className="max-w-7xl mx-auto px-6 py-14">
      <div className="flex items-end justify-between mb-7">
        <div>
          <h2 className="font-display text-3xl font-semibold text-ink">{title}</h2>
          <p className="text-ink-muted mt-1">{subtitle}</p>
        </div>
        <button
          onClick={() => navigate(seeAllPath)}
          className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-brand-600 hover:text-brand-700 transition-colors shrink-0"
        >
          See all <ArrowRight size={15} />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-9">
        {items.slice(0, 3).map((item) => (
          <ListingCard
            key={item.id}
            image={item.image}
            title={item.name}
            city={item.city}
            address={item.address}
            rating={item.rating}
            reviewCount={item.review_count}
            price={item.price}
            priceLabel={item.price_label}
            onClick={() => navigate(seeAllPath)}
          />
        ))}
      </div>

      <button
        onClick={() => navigate(seeAllPath)}
        className="sm:hidden mt-6 w-full py-3 rounded-full border border-black/10 text-sm font-semibold text-ink"
      >
        See all {title.toLowerCase()}
      </button>
    </section>
  );
}

function Home() {
  const { lang } = useLanguage();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("listings")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setListings(data || []);
        setLoading(false);
      });
  }, []);

  const localized = useMemo(() => listings.map((l) => localizeListing(l, lang)), [listings, lang]);
  const homes = localized.filter((l) => l.type === "home");
  const crafts = localized.filter((l) => l.type === "craft");
  const cafes = localized.filter((l) => l.type === "cafe");

  if (loading) {
    return <div className="max-w-3xl mx-auto px-6 py-24 text-center text-ink-muted">Loading...</div>;
  }

  return (
    <div>
      <Helmet>
        <title>budgetravel | Homestays, crafts & cafes in Uzbekistan</title>
        <meta
          name="description"
          content="Book real Uzbek homestays, handmade crafts, and family-run cafes directly — no tourist markup. Stay, eat, and shop with real families across Samarkand, Bukhara, Khiva, and Tashkent."
        />
      </Helmet>

      <Hero homesCount={homes.length} craftsCount={crafts.length} cafesCount={cafes.length} />
      <JourneySection />

      <Section
        title="Featured homestays"
        subtitle="Sleep in a real Uzbek home, not a hotel"
        items={homes}
        seeAllPath="/homes"
      />

      <div className="border-t border-black/5">
        <Section
          title="Handmade crafts"
          subtitle="Bought straight from the artisan who made it"
          items={crafts}
          seeAllPath="/crafts"
        />
      </div>

      <div className="border-t border-black/5">
        <Section
          title="Local cafes"
          subtitle="Where Uzbek families actually eat"
          items={cafes}
          seeAllPath="/cafes"
        />
      </div>

      <div className="border-t border-black/5">
        <HowItWorks />
      </div>

      <div className="border-t border-black/5">
        <FAQSection />
      </div>
    </div>
  );
}

export default Home;