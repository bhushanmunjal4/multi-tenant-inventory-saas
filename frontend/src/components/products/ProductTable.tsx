import { useState } from "react";
import { Package } from "lucide-react";
import type { Product } from "../../types/product.ts";
import Pagination from "../products/Pagination";

interface ProductTableProps {
  data: Product[];
  loading: boolean;

  onEditProduct: (product: Product) => void;
  onSaveProduct: () => Promise<void>;

  onEditVariant: (
    productId: string,
    variantId: string,
    field: string,
    value: unknown,
  ) => void;

  emptyMessage?: string;

  onSaveVariant: () => Promise<void>;

  onSellVariant: (productId: string, variantId: string) => void;
  onViewProduct: (product: Product) => void;
  onDeleteProduct: (productId: string) => Promise<void>;

  editingProduct: Product | null;
  setEditingProduct: React.Dispatch<React.SetStateAction<Product | null>>;

  editingVariant: {
    productId: string;
    variantId: string;
    field: string;
    value: unknown;
  } | null;

  setEditingVariant: React.Dispatch<
    React.SetStateAction<{
      productId: string;
      variantId: string;
      field: string;
      value: unknown;
    } | null>
  >;

  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

const ProductTable = ({
  data,
  loading = false,
  onViewProduct,
  onDeleteProduct,
  emptyMessage = "No products found",
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: ProductTableProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (productId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this product? This action cannot be undone.",
      )
    ) {
      try {
        setDeletingId(productId);
        await onDeleteProduct(productId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const getTotalStock = (product: Product) => {
    return product.variants.reduce(
      (total, variant) => total + variant.stock,
      0,
    );
  };

  const getPriceRange = (product: Product) => {
    if (product.variants.length === 0) return "₹0";

    const prices = product.variants.map((v) => v.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);

    if (minPrice === maxPrice) {
      return `₹${minPrice}`;
    }
    return `₹${minPrice} - ₹${maxPrice}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading products...</span>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12">
        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Package className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 text-lg font-medium">{emptyMessage}</p>
          <p className="text-gray-400 text-sm mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full min-h-0">
      <div className="flex-none border-b border-gray-200 bg-gray-50 rounded-t-xl">
        <div className="grid grid-cols-12 gap-4 px-6 py-3.5">
          <div className="col-span-4 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Product
          </div>
          <div className="col-span-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Category
          </div>
          <div className="col-span-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Price Range
          </div>
          <div className="col-span-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Total Stock
          </div>
          <div className="col-span-1 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            Variants
          </div>
          <div className="col-span-1 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">
            Actions
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
        <div className="divide-y divide-gray-100">
          {data.map((product) => {
            const totalStock = getTotalStock(product);
            const priceRange = getPriceRange(product);
            const hasLowStock = product.variants.some(
              (v) => v.stock <= v.lowStockThreshold,
            );

            return (
              <div
                key={product._id}
                className={`group hover:bg-gray-50 transition-colors ${
                  deletingId === product._id
                    ? "opacity-50 pointer-events-none"
                    : ""
                }`}
              >
                <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                  <div className="col-span-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-gray-900 text-sm">
                        {product.name}
                      </span>
                      {product.description && (
                        <span className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                          {product.description}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-span-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {product.category}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {priceRange}
                    </span>
                  </div>

                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm font-semibold ${
                          hasLowStock
                            ? "text-red-600"
                            : totalStock === 0
                              ? "text-gray-400"
                              : "text-green-600"
                        }`}
                      >
                        {totalStock}
                      </span>
                      {hasLowStock && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700">
                          Low Stock
                        </span>
                      )}
                      {totalStock === 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="col-span-1">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold">
                      {product.variants.length}
                    </span>
                  </div>

                  <div className="col-span-1 flex items-center justify-end gap-2">
                    <button
                      onClick={() => onViewProduct(product)}
                      className="px-3 py-1.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-lg hover:bg-blue-100 transition-colors cursor-pointer"
                      title="View product details"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      disabled={deletingId === product._id}
                      className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-medium rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50 cursor-pointer"
                      title="Delete product"
                    >
                      {deletingId === product._id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex-none border-t border-gray-200 bg-gray-50 rounded-b-xl">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          pageSize={pageSize}
          onPageChange={onPageChange}
          className="px-6 py-3"
          showResultText={true}
          variant="compact"
        />
      </div>
    </div>
  );
};

export default ProductTable;
