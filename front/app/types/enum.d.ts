export { Mode, Size, Notifier, Role };

declare global {
  type Mode = "add" | "edit";
  type Size =
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"
    | "7xl";
  type Notifier =
    | "success"
    | "info"
    | "warning"
    | "error"
    | "delete"
    | "custom";

  type Role = "Admin" | "User";

  type OrderStatus = "pending" | "confirm" | "reject" | "cancel";
}
