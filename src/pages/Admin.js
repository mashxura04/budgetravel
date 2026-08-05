import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { supabase } from "../supabaseClient";

const EMPTY_FORM = {
  id: "",
  type: "home",
  name: "",
  city: "",
  address: "",
  price: "",
  price_label: "/ night",
  rating: "5",
  review_count: "0",
  image: "",
  description: "",
  person_role: "Hosted by",
  person_name: "",
  phone: "",
  telegram: "",
  cta_label: "Request to book",
};

const TRANSLATABLE_FIELDS = [
  "name",
  "city",
  "address",
  "description",
  "person_role",
  "price_label",
  "cta_label",
];

const BOOKING_STATUSES = ["pending", "confirmed", "declined"];
const APPLICATION_STATUSES = ["new", "contacted", "approved", "rejected"];

async function translateText(text, targetLang) {
  if (!text) return "";
  try {
    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLang}`
    );
    const data = await res.json();
    return data?.responseData?.translatedText || text;
  } catch {
    return text;
  }
}

async function buildTranslations(form) {
  const langs = ["ru", "uz"];
  const result = {};

  await Promise.all(
    langs.map(async (lang) => {
      const entries = await Promise.all(
        TRANSLATABLE_FIELDS.map(async (field) => [
          `${field}_${lang}`,
          await translateText(form[field], lang),
        ])
      );
      entries.forEach(([key, value]) => {
        result[key] = value;
      });
    })
  );

  return result;
}

function Admin() {
  const [tab, setTab] = useState("listings");

  const [listings, setListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState(null); // null = form closed, object = editing/creating
  const [saveStage, setSaveStage] = useState(null); // null | "translating" | "saving"
  const [error, setError] = useState("");

  const loadAll = async () => {
    setLoading(true);
    const [listingsRes, bookingsRes, appsRes] = await Promise.all([
      supabase.from("listings").select("*").order("created_at", { ascending: false }),
      supabase.from("booking_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("host_applications").select("*").order("created_at", { ascending: false }),
    ]);
    setListings(listingsRes.data || []);
    setBookings(bookingsRes.data || []);
    setApplications(appsRes.data || []);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
  }, []);

  const openNewListing = () => {
    setError("");
    setForm({ ...EMPTY_FORM, id: `${EMPTY_FORM.type}-${Date.now()}` });
  };

  const openEditListing = (listing) => {
    setError("");
    setForm({ ...listing });
  };

  const closeForm = () => setForm(null);

  const updateField = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSaveListing = async (e) => {
    e.preventDefault();
    setError("");

    setSaveStage("translating");
    const translations = await buildTranslations(form);

    setSaveStage("saving");
    const payload = {
      ...form,
      ...translations,
      price: Number(form.price),
      rating: Number(form.rating),
      review_count: Number(form.review_count),
    };

    const isNew = !listings.some((l) => l.id === form.id);

    const { error } = isNew
      ? await supabase.from("listings").insert(payload)
      : await supabase.from("listings").update(payload).eq("id", form.id);

    setSaveStage(null);

    if (error) {
      setError(error.message);
      return;
    }

    setForm(null);
    loadAll();
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm("Delete this listing? This can't be undone.")) return;
    await supabase.from("listings").delete().eq("id", id);
    loadAll();
  };

  const handleBookingStatus = async (id, status) => {
    await supabase.from("booking_requests").update({ status }).eq("id", id);
    loadAll();
  };

  const handleApplicationStatus = async (id, status) => {
    await supabase.from("host_applications").update({ status }).eq("id", id);
    loadAll();
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-6 py-24 text-center text-ink-muted">
        Loading admin panel...
      </div>
    );
  }

  const saveButtonLabel =
    saveStage === "translating"
      ? "Translating to RU/UZ..."
      : saveStage === "saving"
      ? "Saving..."
      : "Save listing";

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="font-display text-3xl font-semibold text-ink mb-6">Admin</h1>

      <div className="flex items-center gap-2 bg-neutral-50 rounded-full p-1.5 border border-black/5 w-fit mb-8">
        {[
          ["listings", `Listings (${listings.length})`],
          ["bookings", `Bookings (${bookings.length})`],
          ["applications", `Applications (${applications.length})`],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
              tab === key
                ? "bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-brand-glow"
                : "text-ink-soft"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "listings" && (
        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={openNewListing}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold text-sm shadow-brand-glow"
            >
              <Plus size={16} /> Add listing
            </button>
          </div>

          <div className="border border-black/10 rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-left text-ink-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Name</th>
                  <th className="px-4 py-3 font-semibold">Type</th>
                  <th className="px-4 py-3 font-semibold">City</th>
                  <th className="px-4 py-3 font-semibold">Price</th>
                  <th className="px-4 py-3 font-semibold"></th>
                </tr>
              </thead>
              <tbody>
                {listings.map((l) => (
                  <tr key={l.id} className="border-t border-black/5">
                    <td className="px-4 py-3 font-medium text-ink">{l.name}</td>
                    <td className="px-4 py-3 capitalize text-ink-soft">{l.type}</td>
                    <td className="px-4 py-3 text-ink-soft">{l.city}</td>
                    <td className="px-4 py-3 text-ink-soft">
                      ${l.price} {l.price_label}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => openEditListing(l)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-neutral-100"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteListing(l.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-600"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "bookings" && (
        <div className="space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="border border-black/10 rounded-2xl p-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-ink">{b.listing_title}</h3>
                <p className="text-sm text-ink-muted mt-1">
                  {b.guest_name} · {b.guest_email}
                  {b.check_in && ` · ${b.check_in} → ${b.check_out}`}
                </p>
              </div>
              <select
                value={b.status}
                onChange={(e) => handleBookingStatus(b.id, e.target.value)}
                className="border border-black/10 rounded-lg px-3 py-1.5 text-sm font-semibold capitalize"
              >
                {BOOKING_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {tab === "applications" && (
        <div className="space-y-3">
          {applications.map((a) => (
            <div key={a.id} className="border border-black/10 rounded-2xl p-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-semibold text-ink capitalize">{a.listing_type} in {a.city}</h3>
                <p className="text-sm text-ink-muted mt-1">{a.full_name} · {a.email}</p>
                <p className="text-sm text-ink-soft mt-1 max-w-lg">{a.description}</p>
              </div>
              <select
                value={a.status}
                onChange={(e) => handleApplicationStatus(a.id, e.target.value)}
                className="border border-black/10 rounded-lg px-3 py-1.5 text-sm font-semibold capitalize"
              >
                {APPLICATION_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {form && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeForm} />
          <form
            onSubmit={handleSaveListing}
            className="relative bg-white rounded-3xl shadow-2xl w-full max-w-xl p-7 max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={closeForm}
              className="absolute top-5 right-5 w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100"
            >
              <X size={18} />
            </button>

            <h2 className="font-display text-xl font-semibold text-ink mb-1">
              {listings.some((l) => l.id === form.id) ? "Edit listing" : "New listing"}
            </h2>
            <p className="text-xs text-ink-muted mb-5">
              Fill in English — RU and UZ versions are generated automatically when you save.
            </p>

            <div className="grid grid-cols-2 gap-3">
              <select
                value={form.type}
                onChange={updateField("type")}
                className="col-span-2 border border-black/10 rounded-xl p-2.5 text-sm"
              >
                <option value="home">Homestay</option>
                <option value="craft">Craft</option>
                <option value="cafe">Cafe</option>
              </select>

              <input
                required
                placeholder="Name"
                value={form.name}
                onChange={updateField("name")}
                className="col-span-2 border border-black/10 rounded-xl p-2.5 text-sm"
              />
              <input
                required
                placeholder="City"
                value={form.city}
                onChange={updateField("city")}
                className="border border-black/10 rounded-xl p-2.5 text-sm"
              />
              <input
                required
                placeholder="Address"
                value={form.address}
                onChange={updateField("address")}
                className="border border-black/10 rounded-xl p-2.5 text-sm"
              />
              <input
                required
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={updateField("price")}
                className="border border-black/10 rounded-xl p-2.5 text-sm"
              />
              <input
                required
                placeholder="Price label (e.g. / night)"
                value={form.price_label}
                onChange={updateField("price_label")}
                className="border border-black/10 rounded-xl p-2.5 text-sm"
              />
              <input
                type="number"
                step="0.1"
                placeholder="Rating"
                value={form.rating}
                onChange={updateField("rating")}
                className="border border-black/10 rounded-xl p-2.5 text-sm"
              />
              <input
                type="number"
                placeholder="Review count"
                value={form.review_count}
                onChange={updateField("review_count")}
                className="border border-black/10 rounded-xl p-2.5 text-sm"
              />
              <input
                placeholder="Image URL"
                value={form.image}
                onChange={updateField("image")}
                className="col-span-2 border border-black/10 rounded-xl p-2.5 text-sm"
              />
              <textarea
                required
                rows={3}
                placeholder="Description"
                value={form.description}
                onChange={updateField("description")}
                className="col-span-2 border border-black/10 rounded-xl p-2.5 text-sm resize-none"
              />
              <input
                placeholder="Person role (e.g. Hosted by)"
                value={form.person_role}
                onChange={updateField("person_role")}
                className="border border-black/10 rounded-xl p-2.5 text-sm"
              />
              <input
                placeholder="Person name"
                value={form.person_name}
                onChange={updateField("person_name")}
                className="border border-black/10 rounded-xl p-2.5 text-sm"
              />
              <input
                placeholder="Phone"
                value={form.phone}
                onChange={updateField("phone")}
                className="border border-black/10 rounded-xl p-2.5 text-sm"
              />
              <input
                placeholder="Telegram username"
                value={form.telegram}
                onChange={updateField("telegram")}
                className="border border-black/10 rounded-xl p-2.5 text-sm"
              />
              <input
                placeholder="Button label (e.g. Request to book)"
                value={form.cta_label}
                onChange={updateField("cta_label")}
                className="col-span-2 border border-black/10 rounded-xl p-2.5 text-sm"
              />
            </div>

            {error && <p className="text-sm text-red-600 text-center mt-4">{error}</p>}

            <button
              type="submit"
              disabled={saveStage !== null}
              className="w-full mt-5 py-3.5 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-white font-semibold shadow-brand-glow disabled:opacity-60"
            >
              {saveButtonLabel}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Admin;