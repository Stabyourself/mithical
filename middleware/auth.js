// Pages that need a card send you to add one first
export default defineNuxtRouteMiddleware(() => {
  const cards = useState("cards");
  if (!cards.value?.length) {
    return navigateTo("/cards");
  }
});
