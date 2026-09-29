// A song's title in the language chosen in the site settings
export function useSongTitle() {
  const localized = useLocalized();

  return (song) => localized(song, "title");
}
