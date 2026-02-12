import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import {
  Package,
  Truck,
  TrendingDown,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Pagination from "../components/products/Pagination";
import type { LowStockItem } from "../types/lowStock";
import { fetchLowStockItems } from "../services/lowStock.service";

const LowStock = () => {
  const [items, setItems] = useState<LowStockItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLowStock = async () => {
    try {
      const data = await fetchLowStockItems();
      setItems(data);
    } catch (error) {
      console.error("Error fetching low stock", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLowStock();
  }, []);

  const getStockStatusColor = (currentStock: number, threshold: number) => {
    const ratio = currentStock / threshold;
    if (ratio === 0) return "text-red-700 bg-red-50";
    if (ratio <= 0.5) return "text-orange-700 bg-orange-50";
    return "text-yellow-700 bg-yellow-50";
  };

  const getEffectiveStockStatus = (
    effectiveStock: number,
    threshold: number,
  ) => {
    if (effectiveStock >= threshold) return "text-green-700 bg-green-50";
    if (effectiveStock === 0) return "text-red-700 bg-red-50";
    return "text-orange-700 bg-orange-50";
  };

  if (loading) {
    return (
      <Layout>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading stock alerts...</span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center flex-none">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-900">
                Low Stock Alerts
              </h2>
              {items.length > 0 && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                  {items.length} {items.length === 1 ? "Alert" : "Alerts"}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              Monitor products that are running low on stock
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        {items.length > 0 && (
          <div className="flex-none grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Critical Stock</p>
                  <p className="text-2xl font-bold text-red-600">
                    {items.filter((i) => i.currentStock === 0).length}
                  </p>
                </div>
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Out of stock items</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Low Stock</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {
                      items.filter(
                        (i) =>
                          i.currentStock > 0 && i.currentStock < i.threshold,
                      ).length
                    }
                  </p>
                </div>
                <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-yellow-500" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Below threshold</p>
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Incoming Stock</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {items.reduce((sum, i) => sum + i.incomingQty, 0)}
                  </p>
                </div>
                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-blue-500" />
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">Units on the way</p>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="flex-1 min-h-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full min-h-0">
            {/* Table Header - Fixed */}
            <div className="flex-none border-b border-gray-200 bg-gray-50 rounded-t-xl">
              <div className="grid grid-cols-12 gap-4 px-6 py-3.5">
                <div className="col-span-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Product
                </div>
                <div className="col-span-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  SKU
                </div>
                <div className="col-span-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Current Stock
                </div>
                <div className="col-span-1 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Incoming
                </div>
                <div className="col-span-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Effective Stock
                </div>
                <div className="col-span-1 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Threshold
                </div>
                <div className="col-span-1 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </div>
              </div>
            </div>

            {/* Table Body - Scrollable */}
            <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <p className="text-gray-900 text-lg font-medium">
                    All Stocked Up!
                  </p>
                  <p className="text-gray-500 text-sm mt-1 max-w-md text-center">
                    🎉 All products are sufficiently stocked. No low stock
                    alerts at this time.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {items.map((item) => {
                    const stockStatusColor = getStockStatusColor(
                      item.currentStock,
                      item.threshold,
                    );
                    const effectiveStatusColor = getEffectiveStockStatus(
                      item.effectiveStock,
                      item.threshold,
                    );
                    const isCritical = item.currentStock === 0;
                    const isLow = item.currentStock < item.threshold;
                    const willBeRestocked =
                      item.incomingQty > 0 &&
                      item.effectiveStock >= item.threshold;

                    return (
                      <div
                        key={`${item.productId}-${item.variantId}`}
                        className="group hover:bg-gray-50 transition-colors"
                      >
                        <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                          {/* Product Name */}
                          <div className="col-span-3">
                            <div className="flex items-center">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                                  isCritical
                                    ? "bg-red-100"
                                    : isLow
                                      ? "bg-yellow-100"
                                      : "bg-green-100"
                                }`}
                              >
                                {isCritical ? (
                                  <AlertCircle className="w-4 h-4 text-red-600" />
                                ) : isLow ? (
                                  <TrendingDown className="w-4 h-4 text-yellow-600" />
                                ) : (
                                  <Package className="w-4 h-4 text-green-600" />
                                )}
                              </div>
                              <div className="flex flex-col">
                                <span className="font-semibold text-gray-900 text-sm">
                                  {item.productName}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* SKU */}
                          <div className="col-span-2">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700 font-mono">
                              {item.sku}
                            </span>
                          </div>

                          {/* Current Stock */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${stockStatusColor}`}
                              >
                                {item.currentStock} units
                              </span>
                              {item.currentStock === 0 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700">
                                  Out of Stock
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Incoming Stock */}
                          <div className="col-span-1">
                            {item.incomingQty > 0 ? (
                              <div className="flex items-center text-blue-600">
                                <Truck className="w-4 h-4 mr-1.5" />
                                <span className="text-sm font-medium">
                                  +{item.incomingQty}
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-gray-400">—</span>
                            )}
                          </div>

                          {/* Effective Stock */}
                          <div className="col-span-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${effectiveStatusColor}`}
                              >
                                {item.effectiveStock} units
                              </span>
                              {willBeRestocked && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700">
                                  Restocked
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Threshold */}
                          <div className="col-span-1">
                            <span className="text-sm text-gray-600">
                              {item.threshold} units
                            </span>
                          </div>

                          {/* Status */}
                          <div className="col-span-1">
                            {isCritical ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700">
                                Critical
                              </span>
                            ) : isLow ? (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-50 text-yellow-700">
                                Low Stock
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                                Sufficient
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Pagination */}
            {items.length > 0 && (
              <div className="flex-none border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <Pagination
                  currentPage={1}
                  totalPages={1}
                  totalItems={items.length}
                  pageSize={10}
                  onPageChange={() => {}}
                  className="px-6 py-3"
                  showResultText={true}
                  variant="compact"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LowStock;
