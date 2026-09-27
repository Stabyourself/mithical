// Fullscreen lightbox state for a player: Escape closes it, the page doesn't scroll behind it,
// and it closes when the page is left. The template teleports its content to the body while open
export function useLightbox() {
  const expanded = ref(false);

  function onKeyDown(event) {
    if (event.key === "Escape") expanded.value = false;
  }

  watch(expanded, (isExpanded) => {
    document.documentElement.style.overflow = isExpanded ? "hidden" : "";
    if (isExpanded) window.addEventListener("keydown", onKeyDown);
    else window.removeEventListener("keydown", onKeyDown);
  });

  // Pages are kept alive, don't leave it open behind another page
  onDeactivated(() => {
    expanded.value = false;
  });

  onBeforeUnmount(() => {
    expanded.value = false;
    document.documentElement.style.overflow = "";
    window.removeEventListener("keydown", onKeyDown);
  });

  return expanded;
}
