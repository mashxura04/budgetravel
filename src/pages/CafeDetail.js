import { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import ListingDetail from "../components/ListingDetail";
import { useLanguage } from "../context/LanguageContext";
import { supabase } from "../supabaseClient";
import { localizeListing } from "../utils/localize";

function CafeDetail() {
  const { id } = useParams();
  const { lang } = useLanguage();
  const [cafe, setCafe] = useState(undefined);

  useEffect(() => {
    supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .eq("type", "cafe")
      .maybeSingle()
      .then(({ data }) => setCafe(data || null));
  }, [id]);

  if (cafe === undefined) {
    return <div className="max-w-6xl mx-auto px-6 py-24 text-center text-ink-muted">Loading...</div>;
  }

  if (!cafe) return <Navigate to="/cafes" replace />;

  const c = localizeListing(cafe, lang);

  return (
    <>
      <Helmet>
        <title>{c.name} | budgetravel</title>
        <meta name="description" content={c.description} />
      </Helmet>
      <ListingDetail
        listingType="cafe"
        listingId={c.id}
        image={c.image}
        title={c.name}
        city={c.city}
        address={c.address}
        rating={c.rating}
        reviewCount={c.review_count}
        price={c.price}
        priceLabel={c.price_label}
        description={c.description}
        personRole={c.person_role}
        personName={c.person_name}
        telegram={c.telegram}
        ctaLabel={c.cta_label}
      />
    </>
  );
}

export default CafeDetail;