import type { UseFetchOptions } from "#app";
import { merge } from "lodash";

export const useIFetch = <T>(
  endpoint: string,
  options: UseFetchOptions<T> = {},
) => {
  const config = useRuntimeConfig();
  const baseURL = `${config.public.apiBase}${config.public.apiPath}`;
  const jwt = useCookie("jwt");

  const defaults: UseFetchOptions<T> = {
    baseURL,
    headers: jwt.value ? { Authorization: `Bearer ${jwt.value}` } : {},
  };

  const params = merge(options, defaults);

  return useFetch(endpoint, params);
};
