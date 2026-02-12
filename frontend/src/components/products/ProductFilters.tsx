import { Search, Filter } from "lucide-react";

interface ProductFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (value: string) => void;
  lowStockOnly: boolean;
  onLowStockChange: (checked: boolean) => void;
  className?: string;
}

const ProductFilters = ({
  search,
  onSearchChange,
  categoryFilter,
  onCategoryFilterChange,
  lowStockOnly,
  onLowStockChange,
  className = "",
}: ProductFiltersProps) => {
  return (
    <div
      className={`bg-white p-4 rounded-xl shadow-sm border border-gray-100 ${className}`}
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="flex-1 relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Filter by category..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
          />
        </div>

        <label className="inline-flex items-center px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
          <input
            type="checkbox"
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
            checked={lowStockOnly}
            onChange={(e) => onLowStockChange(e.target.checked)}
          />
          <span className="text-sm font-medium text-gray-700">
            Low stock only
          </span>
        </label>
      </div>
    </div>
  );
};

export default ProductFilters;
