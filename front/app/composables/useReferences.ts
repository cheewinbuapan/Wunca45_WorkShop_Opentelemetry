export default () => {
  const { t } = useNuxtApp().$i18n;
  const localePath = useLocalePath();
  return {
    thaiRegex:
      /^[กขฃคฅฆงจฉชซฌญฎฏฐฑฒณดตถทธนบปผฝพฟภมยรฤลฦวศษสหฬอฮฯะัาำิีึืฺุูเแโใไๅๆ็่้๊๋์]+$/,
    genders: [
      { value: "male", label: "ชาย" },
      { value: "female", label: "หญิง" },
    ],
    roles: [
      { value: "admin", label: "Admin" },
      { value: "user", label: "ผู้ใช้งาน" },
    ],
    orderStatuses: [
      { value: "pending", label: "รอการยืนยันคำสั่งซื้อ" },
      { value: "confirm", label: "ยืนยันคำสั่งซื้อ" },
      { value: "reject", label: "ปฏิเสธคำสั่งซื้อ" },
      { value: "cancel", label: "ยกเลิกคำสั่งซื้อ" },
    ],
    rowsPerPages: [
      { value: 10, label: 10 },
      { value: 20, label: 20 },
      { value: 30, label: 30 },
      { value: 50, label: 50 },
      { value: 100, label: 100 },
      { value: -1, label: t("ALL") },
    ],
    menus: {
      menus: [
        [
          {
            label: "จัดการข้อมูล",
            type: "label",
          },
          {
            label: "การสั่งซื้อ",
            icon: "i-fa6-solid-clipboard-list",
            to: localePath({ name: "admin-orders" }),
            roles: ["Admin"],
          },
          {
            label: "สินค้า",
            icon: "i-fa6-solid-box",
            to: localePath({ name: "admin-products" }),
            roles: ["Admin"],
          },
        ],
      ] as NavigationLinkItem[][],
    },
  };
};
