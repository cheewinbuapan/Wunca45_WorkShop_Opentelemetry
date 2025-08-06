export default (tel: string) => {
  return tel.length === 10
    ? tel.substring(0, 3) +
        " " +
        tel.substring(3, 6) +
        " " +
        tel.substring(6, 10)
    : tel;
};
