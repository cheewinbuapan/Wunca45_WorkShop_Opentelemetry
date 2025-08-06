export default (path?: string): string => {
  const config = useRuntimeConfig();
  const base = config.public.webBase;
  if (!path || !path.includes(base)) {
    return `${base}${path || ""}`;
  }
  return path;
};
