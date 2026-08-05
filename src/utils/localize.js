const FIELDS = ["name", "city", "address", "description", "person_role", "price_label", "cta_label"];

export function localizeListing(item, lang) {
  if (!item) return item;
  if (lang === "en") return item;

  const localized = { ...item };
  FIELDS.forEach((field) => {
    const value = item[`${field}_${lang}`];
    if (value) {
      localized[field] = value;
    }
  });
  return localized;
}