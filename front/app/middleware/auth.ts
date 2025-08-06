import { setUser } from "@sentry/nuxt";

export default defineNuxtRouteMiddleware(async () => {
  const auth = authen();
  if (!auth.loggedIn) {
    abortNavigation();
    return navigateTo(useLocalePath()({ name: "login" }));
  } else {
    apiRefs().initializeBack();
    setUser({
      username: auth.user?.username,
    });
    cart().refreshCartKey();
  }
});
