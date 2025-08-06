export default defineNuxtRouteMiddleware(async () => {
  await apiRefs().initialize();
});
