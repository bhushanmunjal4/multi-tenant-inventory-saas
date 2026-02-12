import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  DollarSign,
  Package,
  ShoppingBag,
  AlertCircle,
  Truck,
  BarChart3,
  Zap,
} from "lucide-react";
import { fetchDashboardData } from "../services/dashoard.service";
import type { DashboardData } from "../types/dashboard";

const Dashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setError(null);
        const dashboard = await fetchDashboardData();
        setData(dashboard);
      } catch (error) {
        console.error("Dashboard fetch error", error);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  // Custom tooltip for chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
          <p className="text-sm font-medium text-gray-900 mb-2">
            {formatDate(label)}
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            <span className="text-sm text-gray-600">Movements:</span>
            <span className="text-sm font-bold text-gray-900">
              {payload[0].value}
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
          </div>
          <p className="mt-6 text-lg font-medium text-gray-700">
            Loading dashboard...
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Fetching your inventory data
          </p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <p className="mt-6 text-lg font-medium text-gray-900">
            Failed to load data
          </p>
          <p className="mt-2 text-sm text-gray-500">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </Layout>
    );
  }

  const hasStockData = data?.stockGraph && data.stockGraph.length > 0;
  const hasTopSellers = data?.topSellers && data.topSellers.length > 0;

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back! Here's an overview of your inventory
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">
                Last updated:{" "}
                {new Date().toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Inventory Value
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {data?.inventoryValue
                      ? formatCurrency(data.inventoryValue)
                      : "₹0"}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Total stock value
                  </p>
                </div>
                <div className="w-14 h-14 bg-linear-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-100">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-blue-500 to-blue-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </div>

          <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-purple-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Top Sellers
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {data?.topSellers?.length || 0}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Best performing products
                  </p>
                </div>
                <div className="w-14 h-14 bg-linear-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-100">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-purple-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </div>

          <div className="group relative bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-green-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Stock Movements
                  </p>
                  <p className="mt-2 text-3xl font-bold text-gray-900">
                    {data?.stockGraph?.length || 0}
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    Days with movement data
                  </p>
                </div>
                <div className="w-14 h-14 bg-linear-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-100">
                  <Package className="w-7 h-7 text-white" />
                </div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-linear-to-r from-green-500 to-green-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Stock Movement Analysis
                </h2>
                <p className="text-sm text-gray-500">
                  Daily inventory movement over the last 7 days
                </p>
              </div>
            </div>

            {hasStockData && (
              <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
                <span className="text-xs font-medium text-gray-700">
                  Total:{" "}
                  {data?.stockGraph.reduce(
                    (acc, curr) => acc + curr.totalMovement,
                    0,
                  )}{" "}
                  units
                </span>
              </div>
            )}
          </div>

          {!hasStockData ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <Package className="w-12 h-12 text-gray-300" />
              </div>
              <p className="text-lg font-medium text-gray-700">
                No movement data available
              </p>
              <p className="mt-2 text-sm text-gray-400 text-center max-w-md">
                Stock movement data will appear here once products start moving
                in and out of inventory
              </p>
            </div>
          ) : (
            <div className="h-100 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={data.stockGraph}
                  margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
                >
                  <defs>
                    <linearGradient
                      id="movementlinear"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                      <stop
                        offset="95%"
                        stopColor="#3B82F6"
                        stopOpacity={0.2}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="#E5E7EB"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatDate}
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    axisLine={{ stroke: "#E5E7EB" }}
                    tickLine={{ stroke: "#E5E7EB" }}
                  />
                  <YAxis
                    tick={{ fontSize: 12, fill: "#6B7280" }}
                    axisLine={{ stroke: "#E5E7EB" }}
                    tickLine={{ stroke: "#E5E7EB" }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="totalMovement"
                    fill="url(#movementlinear)"
                    radius={[8, 8, 0, 0]}
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  Top Selling Products
                </h2>
                <p className="text-sm text-gray-500">
                  Best performing variants in the last 30 days
                </p>
              </div>
            </div>

            {hasTopSellers && (
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-50 rounded-lg">
                <TrendingUp className="w-4 h-4 text-purple-600" />
                <span className="text-xs font-medium text-purple-700">
                  Total sold:{" "}
                  {data?.topSellers.reduce(
                    (acc, curr) => acc + curr.totalSold,
                    0,
                  )}{" "}
                  units
                </span>
              </div>
            )}
          </div>

          {!hasTopSellers ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                <ShoppingBag className="w-12 h-12 text-gray-300" />
              </div>
              <p className="text-lg font-medium text-gray-700">
                No sales data available
              </p>
              <p className="mt-2 text-sm text-gray-400 text-center max-w-md">
                Top selling products will appear here once you start making
                sales
              </p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <div className="grid grid-cols-1 gap-3">
                {data.topSellers.slice(0, 5).map((seller, index) => (
                  <div
                    key={seller.productId}
                    className="group flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`
                        w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm
                        ${index === 0 ? "bg-yellow-100 text-yellow-700" : ""}
                        ${index === 1 ? "bg-gray-200 text-gray-700" : ""}
                        ${index === 2 ? "bg-orange-100 text-orange-700" : ""}
                        ${index > 2 ? "bg-purple-100 text-purple-700" : ""}
                      `}
                      >
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                          {seller.productName}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          SKU: {seller.variantSku}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {seller.totalSold}
                        </p>
                        <p className="text-xs text-gray-500">units sold</p>
                      </div>
                      <div className="w-1 h-8 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            index === 0
                              ? "bg-yellow-500"
                              : index === 1
                                ? "bg-gray-500"
                                : index === 2
                                  ? "bg-orange-500"
                                  : "bg-purple-500"
                          }`}
                          style={{
                            width: "100%",
                            height: `${(seller.totalSold / (data.topSellers[0]?.totalSold || 1)) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {data.topSellers.length > 5 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                    View all {data.topSellers.length} products
                    <TrendingUp className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
              <Package className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">Add Product</p>
              <p className="text-xs text-gray-500">Create new inventory item</p>
            </div>
          </button>

          <button className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all group">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors">
              <Truck className="w-5 h-5 text-green-600 group-hover:text-white transition-colors" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">Create PO</p>
              <p className="text-xs text-gray-500">Order from supplier</p>
            </div>
          </button>

          <button className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all group">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors">
              <BarChart3 className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-gray-900">View Reports</p>
              <p className="text-xs text-gray-500">Detailed analytics</p>
            </div>
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
