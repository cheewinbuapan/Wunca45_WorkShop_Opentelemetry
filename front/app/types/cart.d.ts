export { Cart };

declare global {
  interface Cart {
    product: Product;
    quantity: number;
    select: boolean;
  }
}
