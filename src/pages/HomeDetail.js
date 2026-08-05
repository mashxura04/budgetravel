import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ListingDetail from "../components/ListingDetail";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../supabaseClient";
import { localizeListing } from "../utils/localize";

function HomeDetail() {
  const { id } = useParams();
  const { lang } = useLanguage();
  const [home, setHome] = useState(undefined);

  useEffect(() => {
    supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .eq("type", "home")
      .maybeSingle()
      .then(({ data }) => setHome(data || null));
  }, [id]);

  if (home === undefined) {
    return <div className="max-w-6xl mx-auto px-6 py-24 text-center text-ink-muted">Loading...</div>;
  }

  if (!home) return <Navigate to="/homes" replace />;

  const h = localizeListing(home, lang);

  return (
    <>
      <Helmet>
        <title>{h.name} | budgetravel</title>
        <meta name="description" content={h.description} />
      </Helmet>
      <ListingDetail
        listingType="home"
        listingId={h.id}
        image={h.image}
        title={h.name}
        city={h.city}
        address={h.address}
        rating={h.rating}
        reviewCount={h.review_count}
        price={h.price}
        priceLabel={h.price_label}
        description={h.description}
        personRole={h.person_role}
        personName={h.person_name}
        telegram={h.telegram}
        ctaLabel={h.cta_label}
      />
    </>
  );
}

export default HomeDetail;