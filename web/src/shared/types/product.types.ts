export type ProductUnitOfMeasure =
  | 'UNIT'
  | 'PACK'
  | 'BOX'
  | 'CASE'
  | 'KG'
  | 'LITRE';

export interface Product {
  productId: string;
  productCode: string;
  productName: string;
  description: string | null;
  unitOfMeasure: ProductUnitOfMeasure;
  unitWeightKg: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
