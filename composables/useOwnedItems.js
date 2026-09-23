import { toRaw } from "vue";

// one Set shared by every item on the page instead of each one
// looping over all owned items
let cache = { items: null, length: -1, set: new Set() };

function ownedSet(items) {
  const raw = toRaw(items);
  if (cache.items !== raw || cache.length !== raw.length) {
    cache = {
      items: raw,
      length: raw.length,
      set: new Set(raw.map((item) => item.item_id)),
    };
  }
  return cache.set;
}

export function useOwnedItems() {
  const profile = useState("profile");

  return (id) => {
    const items = profile.value?.items;
    if (!items) return false;
    // reading length keeps it reactive, so gacha pulls still show up
    items.length;
    return ownedSet(items).has(id);
  };
}
