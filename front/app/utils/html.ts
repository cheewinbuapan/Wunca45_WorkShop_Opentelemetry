export const html = {
  regexNoHtml: /(<[^>]*>)/g,
  removeHtml: (str: string) => {
    return str
      .replaceAll(html.regexNoHtml, "")
      .replaceAll("&nbsp;", " ")
      .replaceAll("&emsp;", " ");
  },
  addUrlHttp: (url: string) => {
    if (url && !/^https?:\/\//i.test(url)) {
      url = `http://${url}`;
    }
    return url;
  },
};
