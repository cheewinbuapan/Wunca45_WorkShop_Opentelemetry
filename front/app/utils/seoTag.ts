interface SEOData {
  title?: string;
  description?: string;
  lang?: string;
  keywords?: string;
  urlPath?: string;
  imagePath?: string;
}
export default (data: SEOData) => {
  const config = useRuntimeConfig();
  const dataTitle = data.title
    ? `${data.title} - ${config.public.metaDefaultTitle}`
    : config.public.metaDefaultTitle;
  const dataDescription = data.description
    ? data.description.replace(/<[^>]*>/g, "")
    : typeof config.public.metaDefaultDescription === "string"
      ? config.public.metaDefaultDescription.replace(/<[^>]*>/g, "")
      : "";
  return {
    htmlAttrs: {
      lang:
        data.lang ||
        useNuxtApp().$i18n.locale.value ||
        (config.public.metaDefaultLang ? config.public.metaDefaultLang : "en"),
    },
    title: dataTitle,
    meta: [
      {
        hid: "title",
        name: "title",
        content: dataTitle,
      },
      {
        hid: "description",
        name: "description",
        content: dataDescription,
      },
      {
        name: "keywords",
        content:
          data.keywords ||
          (typeof config.public.metaDefaultKeywords === "string"
            ? config.public.metaDefaultKeywords.split(",")
            : []),
      },
      {
        property: "og:title",
        name: "og:title",
        content: dataTitle,
      },
      {
        property: "og:type",
        name: "og:type",
        content: "website",
      },
      {
        property: "og:description",
        name: "og:description",
        content: dataDescription,
      },
      {
        property: "og:url",
        name: "og:url",
        content: data.urlPath
          ? `${config.public.webBase}${useRoute().fullPath}`
          : config.public.metaDefaultUrl
            ? config.public.metaDefaultUrl
            : "",
      },
      {
        property: "og:site_name",
        name: "og:site_name",
        content: config.public.metaDefaultSiteName
          ? config.public.metaDefaultSiteName
          : "",
      },
      {
        property: "og:image",
        name: "og:image",
        content:
          data.imagePath ||
          (config.public.metaDefaultImage
            ? config.public.metaDefaultImage
            : ""),
      },
      {
        property: "twitter:card",
        name: "twitter:card",
        content: "summary_large_image",
      },
      {
        property: "twitter:site",
        name: "twitter:site",
        content: "@publisher_handle",
      },
      {
        property: "twitter:url",
        name: "twitter:url",
        content: data.urlPath
          ? `${config.public.webBase}${useRoute().fullPath}`
          : config.public.metaDefaultUrl
            ? config.public.metaDefaultUrl
            : "",
      },
      {
        property: "twitter:title",
        name: "twitter:title",
        content: dataTitle,
      },
      {
        property: "twitter:description",
        name: "twitter:description",
        content: dataDescription,
      },
      {
        property: "twitter:image",
        name: "twitter:image",
        content:
          data.imagePath ||
          (config.public.metaDefaultImage
            ? config.public.metaDefaultImage
            : ""),
      },
    ],
    link: [
      {
        rel: "canonical",
        href: data.urlPath
          ? `${config.public.webBase}${useRoute().fullPath}`
          : config.public.metaDefaultUrl
            ? config.public.metaDefaultUrl
            : "",
      },
    ],
  };
};
