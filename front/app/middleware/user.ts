export default defineNuxtRouteMiddleware(() => {
  if (!["User"].includes(authen().user?.role!)) {
    abortNavigation();
    return navigateTo(useLocalePath()({ name: "admin" }));
  }
});
