import * as Sentry from "@sentry/nuxt";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const sentryDsn = config.public.sentryDsn;
  const sentryEnv = config.public.nodeEnv;
  Sentry.init({
    dsn: sentryDsn,
    environment: sentryEnv,
    enabled: !!sentryDsn,

    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    integrations: [Sentry.replayIntegration()],

    debug: sentryEnv !== "production",
    enableLogs: true,

    beforeSend(event) {
      if (event.tags?.feature === "non-critical") return null;
      if (event.exception?.values?.[0]?.type === "TimeoutError") return null;
      return event;
    },
  });
});
