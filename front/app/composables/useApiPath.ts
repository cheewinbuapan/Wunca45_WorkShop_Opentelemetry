export default (path: string = "", addApiPath: boolean = false): string => {
  const config = useRuntimeConfig();
  if (!path.includes(config.public.apiBase)) {
    return `${config.public.apiBase}${addApiPath ? config.public.apiPath : ""}${path || ""}`;
  } else {
    return path;
  }
};
