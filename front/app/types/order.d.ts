export { Order, OrderDetail, OrderChangeStatus } from "~/types/order";

declare global {
  interface OrderDetail extends ID {
    productId: number;
    quantity: number;
    price?: number;
    productName?: string;
    productImageUrl?: string;
    productDescription?: string;
    productCategory?: string;
  }

  interface Order extends ID, Timestamp {
    status?: OrderStatus;
    shippingAddress: string;
    orderDetails: OrderDetail[];
    user?: Me;
  }

  interface OrderChangeStatus {
    status: OrderStatus;
  }
}
