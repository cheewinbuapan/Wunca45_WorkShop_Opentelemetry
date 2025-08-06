import { find } from "lodash";
export default (num: number, digitOptions: Intl.NumberFormatOptions = {}) => {
  const { locale, locales } = useNuxtApp().$i18n;
  return new Intl.NumberFormat(
    String(find(locales.value, { code: locale.value })!.iso),
    digitOptions,
  ).format(num);
};
