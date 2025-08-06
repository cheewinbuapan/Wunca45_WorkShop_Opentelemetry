export { Product };

declare global {
  interface Product extends ID, Timestamp {
    name: string;
    description: string;
    price?: number;
    stock?: number;
    category: string;
    imageUrl: string;
  }
}
