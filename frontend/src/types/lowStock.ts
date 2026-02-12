export interface LowStockItem {
  productId: string;
  productName: string;
  variantId: string;
  sku: string;
  currentStock: number;
  incomingQty: number;
  effectiveStock: number;
  threshold: number;
}
