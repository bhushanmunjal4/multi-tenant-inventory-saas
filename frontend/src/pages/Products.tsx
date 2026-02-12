import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Package } from "lucide-react";

import Layout from "../components/layout/Layout";
import { useAuth } from "../context/useAuth";
import { useToast } from "../context/ToastContext";
import { AxiosError } from "axios";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  sellVariant,
  updateVariant,
} from "../services/product.service";
import type { Product, NewProduct } from "../types/product.ts";

import ProductTable from "../components/products/ProductTable";
import ProductFilters from "../components/products/ProductFilters";
import ProductModals from "../components/products/ProductModals";
import ProductViewModal from "../components/products/ProductViewModal";

const Products = () => {
  const { showToast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [lowStockOnly, setLowStockOnly] = useState(false);

  const [page, setPage] = useState(() => {
    const pageParam = searchParams.get("page");
    return pageParam ? parseInt(pageParam) : 1;
  });
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 10;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingVariant, setEditingVariant] = useState<{
    productId: string;
    variantId: string;
    field: string;
    value: any;
  } | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    null,
  );
  const [sellQuantity, setSellQuantity] = useState(1);
  const [selling, setSelling] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const [newProduct, setNewProduct] = useState<NewProduct>({
    name: "",
    category: "",
    description: "",
    variants: [
      {
        sku: "",
        price: 0,
        stock: 0,
        lowStockThreshold: 5,
        attributes: { size: "", color: "" },
      },
    ],
  });

  const fetchProducts = async (currentPage = 1) => {
    try {
      setLoading(true);

      const data = await getProducts(currentPage, pageSize);

      setProducts(data.products);
      setTotalPages(data.totalPages);
      setTotalItems(data.total);
      setPage(data.page);
    } catch {
      showToast("Error fetching products", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSearchParams({ page: page.toString() });
  }, [page, setSearchParams]);

  useEffect(() => {
    const pageParam = searchParams.get("page");
    if (pageParam) {
      setPage(parseInt(pageParam));
    }
  }, []);

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory = categoryFilter
      ? product.category.toLowerCase().includes(categoryFilter.toLowerCase())
      : true;

    const matchesLowStock = lowStockOnly
      ? product.variants.some((v) => v.stock <= v.lowStockThreshold)
      : true;

    return matchesSearch && matchesCategory && matchesLowStock;
  });

  const handleEditProduct = (product: Product) => {
    setEditingProduct(JSON.parse(JSON.stringify(product)));
  };

  const handleSaveProduct = async () => {
    if (!editingProduct) return;

    try {
      await updateProduct(editingProduct._id, editingProduct);
      setEditingProduct(null);
      await fetchProducts(page);
      showToast("Product updated successfully", "success");
    } catch (error) {
      if (error instanceof AxiosError) {
        showToast(
          error.response?.data?.message || "Error updating product",
          "error",
        );
      }
    }
  };

  const handleEditVariant = (
    productId: string,
    variantId: string,
    field: string,
    value: any,
  ) => {
    setEditingVariant({ productId, variantId, field, value });
  };

  const handleSaveVariant = async () => {
    if (!editingVariant) return;

    try {
      const { productId, variantId, field, value } = editingVariant;

      setProducts((prev) =>
        prev.map((product) => {
          if (product._id === productId) {
            return {
              ...product,
              variants: product.variants.map((variant) => {
                if (variant._id === variantId) {
                  if (field.startsWith("attributes.")) {
                    const attrField = field.split(".")[1];
                    return {
                      ...variant,
                      attributes: {
                        ...variant.attributes,
                        [attrField]: value,
                      },
                    };
                  }
                  return { ...variant, [field]: value };
                }
                return variant;
              }),
            };
          }
          return product;
        }),
      );

      await updateVariant(productId, variantId, { [field]: value });

      setEditingVariant(null);
      showToast("Variant updated successfully", "success");
    } catch (error) {
      if (error instanceof AxiosError) {
        showToast(
          error.response?.data?.message || "Error updating variant",
          "error",
        );
      }
    }
  };

  const handleSellVariant = (productId: string, variantId: string) => {
    setSelectedProductId(productId);
    setSelectedVariantId(variantId);
    setSellQuantity(1);
    setSellModalOpen(true);
  };

  const handleConfirmSale = async () => {
    try {
      setSelling(true);
      await sellVariant(selectedProductId!, selectedVariantId!, sellQuantity);
      setSellModalOpen(false);
      await fetchProducts(page);
      showToast("Sale completed successfully", "success");
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        showToast(
          error?.response?.data?.message || "Error selling product",
          "error",
        );
      } else {
        showToast("Unexpected error occurred", "error");
      }
    } finally {
      setSelling(false);
    }
  };

  const handleCreateProduct = async () => {
    try {
      await createProduct(newProduct);
      setIsAddModalOpen(false);
      await fetchProducts(page);
      showToast("Product created successfully", "success");

      setNewProduct({
        name: "",
        category: "",
        description: "",
        variants: [
          {
            sku: "",
            price: 0,
            stock: 0,
            lowStockThreshold: 5,
            attributes: { size: "", color: "" },
          },
        ],
      });
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        showToast(
          error.response?.data?.message || "Error creating product",
          "error",
        );
      } else {
        showToast("Unexpected error occurred", "error");
      }
    }
  };

  const handleViewProduct = (product: Product) => {
    setViewingProduct(product);
    setIsViewModalOpen(true);
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      await fetchProducts(page);
      showToast("Product deleted successfully", "success");
    } catch (error) {
      if (error instanceof AxiosError) {
        showToast(
          error.response?.data?.message || "Error deleting product",
          "error",
        );
      }
      throw error;
    }
  };

  const handleSaveProductFromModal = async (updatedProduct: Product) => {
    try {
      await updateProduct(updatedProduct._id, updatedProduct);
      await fetchProducts(page);
      showToast("Product updated successfully", "success");
    } catch (error) {
      if (error instanceof AxiosError) {
        showToast(
          error.response?.data?.message || "Error updating product",
          "error",
        );
      }
      throw error;
    }
  };

  return (
    <Layout>
      <div className="space-y-6 h-full flex flex-col">
        <div className="flex justify-between items-center flex-none">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Products</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage your product inventory and variants
            </p>
          </div>
          {(user?.role === "OWNER" || user?.role === "MANAGER") && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors shadow-sm hover:shadow-md"
            >
              <Package className="w-4 h-4 mr-2" />
              Add Product
            </button>
          )}
        </div>

        <ProductFilters
          search={search}
          onSearchChange={setSearch}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          lowStockOnly={lowStockOnly}
          onLowStockChange={setLowStockOnly}
          className="flex-none"
        />

        <div className="flex-1 min-h-0">
          <ProductTable
            data={filteredProducts}
            loading={loading}
            onEditProduct={handleEditProduct}
            onSaveProduct={handleSaveProduct}
            onEditVariant={handleEditVariant}
            onSaveVariant={handleSaveVariant}
            onSellVariant={handleSellVariant}
            onViewProduct={handleViewProduct}
            onDeleteProduct={handleDeleteProduct}
            editingProduct={editingProduct}
            setEditingProduct={setEditingProduct}
            editingVariant={editingVariant}
            setEditingVariant={setEditingVariant}
            emptyMessage="No products found"
            currentPage={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        </div>

        <ProductModals
          isAddModalOpen={isAddModalOpen}
          onCloseAddModal={() => setIsAddModalOpen(false)}
          newProduct={newProduct}
          onNewProductChange={(product: NewProduct) => setNewProduct(product)}
          onCreateProduct={handleCreateProduct}
          isSellModalOpen={sellModalOpen}
          onCloseSellModal={() => setSellModalOpen(false)}
          sellQuantity={sellQuantity}
          onSellQuantityChange={setSellQuantity}
          onConfirmSale={handleConfirmSale}
          selling={selling}
        />

        <ProductViewModal
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setViewingProduct(null);
          }}
          product={viewingProduct}
          onSave={handleSaveProductFromModal}
        />
      </div>
    </Layout>
  );
};

export default Products;
