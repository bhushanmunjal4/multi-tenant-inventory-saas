export interface TopSeller {
  productId: string;
  productName: string;
  variantSku: string;
  totalSold: number;
}

export interface StockGraphPoint {
  date: string; // ISO date string
  totalMovement: number;
}

export interface DashboardData {
  inventoryValue: number;
  topSellers: TopSeller[];
  stockGraph: StockGraphPoint[];
}
