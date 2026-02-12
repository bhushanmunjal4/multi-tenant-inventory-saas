export interface POItem {
  productId: string;
  variantId: string;
  orderedQty: number;
  receivedQty?: number;
  price: number;
}

export interface PurchaseOrder {
  _id: string;
  supplierId: string;
  status: string;
  expectedDate: string;
  items: POItem[];
}

export interface Supplier {
  _id: string;
  name: string;
}

export interface ProductVariant {
  _id: string;
  sku: string;
}

export interface ProductBasic {
  _id: string;
  name: string;
  variants: ProductVariant[];
}
