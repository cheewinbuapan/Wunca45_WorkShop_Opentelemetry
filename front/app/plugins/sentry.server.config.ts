import * as Sentry from "@sentry/nuxt";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const sentryDsn = config.public.sentryDsn;
  const sentryEnv = config.public.nodeEnv;
  Sentry.init({
    dsn: sentryDsn,
    environment: sentryEnv,
    enabled: !!sentryDsn && sentryEnv === "production",

    tracesSampleRate: 1.0,

    enableLogs: true,

    debug: process.env.NUXT_NODE_ENV !== "production",
  });
});
