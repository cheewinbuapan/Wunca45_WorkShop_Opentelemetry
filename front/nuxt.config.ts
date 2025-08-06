// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/ui",
    "@pinia/nuxt",
    "@nuxt/eslint",
    "@nuxtjs/google-fonts",
    "@nuxtjs/i18n",
    "dayjs-nuxt",
    "@sentry/nuxt/module",
  ],

  pinia: {
    storesDirs: ["./app/stores/**"],
  },

  css: ["~/assets/main.css"],

  ui: {
    colorMode: false,
  },

  googleFonts: {
    families: {
      Sarabun: true,
      Prompt: true,
    },
  },

  i18n: {
    defaultLocale: "th",
    locales: [
      {
        code: "en",
        countryCode: "us",
        name: "English",
        subName: "อังกฤษ",
        iso: "en-US",
        file: "en.json",
      },
      {
        code: "th",
        countryCode: "th",
        name: "ไทย",
        subName: "Thai",
        iso: "th-TH",
        file: "th.json",
      },
    ],
  },

  dayjs: {
    locales: ["en", "th"],
    defaultLocale: "en",
    defaultTimezone: "Asia/Bangkok",
    plugins: [
      "utc",
      "timezone",
      "buddhistEra",
      "localeData",
      "relativeTime",
      "duration",
      "isSameOrBefore",
      "isSameOrAfter",
    ],
  },

  runtimeConfig: {
    public: {
      appName: process.env.NUXT_PUBLIC_APP_NAME || "APP NAME",
      webBase: process.env.NUXT_PUBLIC_WEB_BASE || "http://localhost:3000",
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "http://localhost:5000",
      apiPath: process.env.NUXT_PUBLIC_API_PATH || "/api/",
      sentryDsn: process.env.NUXT_PUBLIC_SENTRY_DSN || "",
      nodeEnv: process.env.NUXT_NODE_ENV || "development",
    },
  },

  sentry: {
    sourceMapsUploadOptions: {
      org: process.env.NUXT_SENTRY_UPLOAD_OPTION_ORG,
      project: process.env.NUXT_SENTRY_UPLOAD_OPTION_PROJECT,
      authToken: process.env.NUXT_SENTRY_UPLOAD_OPTION_AUTH_TOKEN,
    },
  },

  sourcemap: {
    client: "hidden",
  },
});
