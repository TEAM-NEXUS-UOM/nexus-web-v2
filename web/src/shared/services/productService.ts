import type { Product } from '../types/product.types.ts';
import { mockProducts } from '../mock/products.ts';

export const getAllProducts = (): Product[] => {
  return mockProducts;
};

export const getProductById = (productId: string): Product | undefined => {
  return mockProducts.find((product) => product.productId === productId);
};

export const getActiveProducts = (): Product[] => {
  return mockProducts.filter((product) => product.isActive);
};
