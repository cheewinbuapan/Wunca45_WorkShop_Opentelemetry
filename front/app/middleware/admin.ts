export default defineNuxtRouteMiddleware(() => {
  if (!["Admin"].includes(authen().user?.role!)) {
    abortNavigation();
    return navigateTo(useLocalePath()({ name: "index" }));
  }
});
