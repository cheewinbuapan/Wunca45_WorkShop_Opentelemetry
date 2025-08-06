export default defineNuxtRouteMiddleware(() => {
  sidebar().drawer = false;
  useNuxtApp().$i18n.setLocale("th");
});
