// Text in the language chosen in the site settings.
// Data files store the English text next to the Japanese, as `<key>English`
// (name / nameEnglish), and English falls back to Japanese when it's missing
export function useLocalized() {
  const language = useState("language");

  return (obj, key = "name") => {
    if (!obj) return "";
    if (language.value === "ja") return obj[key];
    return obj[`${key}English`] || obj[key];
  };
}

// Categories and versions are { ja, en } instead
export function useCategoryName() {
  const language = useState("language");

  return (category) => (language.value === "ja" ? category.ja : category.en);
}
