import { Plus, Minus } from "lucide-react";
import Modal from "../ui/Modal";
import type {
  Product,
  NewProduct,
  NewProductVariant,
} from "../../types/product.ts";

interface ProductModalsProps {
  isAddModalOpen: boolean;
  onCloseAddModal: () => void;
  newProduct: NewProduct;
  onNewProductChange: (product: NewProduct) => void;
  onCreateProduct: () => Promise<void>;

  // Sell Modal Props
  isSellModalOpen: boolean;
  onCloseSellModal: () => void;
  sellQuantity: number;
  onSellQuantityChange: (quantity: number) => void;
  onConfirmSale: () => Promise<void>;
  selling: boolean;

  viewProduct?: Product | null;
  onCloseViewModal?: () => void;
  onViewProductChange?: (product: Product) => void;
  onSaveViewProduct?: () => Promise<void>;
}

const ProductModals = ({
  isAddModalOpen,
  onCloseAddModal,
  newProduct,
  onNewProductChange,
  onCreateProduct,
  isSellModalOpen,
  onCloseSellModal,
  sellQuantity,
  onSellQuantityChange,
  onConfirmSale,
  selling,
  viewProduct = null,
  onCloseViewModal = () => {},
  onViewProductChange = () => {},
  onSaveViewProduct = async () => {},
}: ProductModalsProps) => {
  const handleVariantChange = (
    index: number,
    field: keyof NewProductVariant,
    value: string | number,
  ) => {
    const updatedVariants = [...newProduct.variants];

    if (
      field === "price" ||
      field === "stock" ||
      field === "lowStockThreshold"
    ) {
      updatedVariants[index] = {
        ...updatedVariants[index],
        [field]: Number(value),
      };
    } else if (field === "sku") {
      updatedVariants[index] = {
        ...updatedVariants[index],
        sku: String(value),
      };
    }

    onNewProductChange({
      ...newProduct,
      variants: updatedVariants,
    });
  };

  const handleAttributeChange = (
    index: number,
    attributeKey: string,
    value: string,
  ) => {
    const updatedVariants = [...newProduct.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      attributes: {
        ...updatedVariants[index].attributes,
        [attributeKey]: value,
      },
    };

    onNewProductChange({
      ...newProduct,
      variants: updatedVariants,
    });
  };

  const addVariant = () => {
    onNewProductChange({
      ...newProduct,
      variants: [
        ...newProduct.variants,
        {
          sku: "",
          price: 0,
          stock: 0,
          lowStockThreshold: 5,
          attributes: { size: "", color: "" },
        },
      ],
    });
  };

  const removeVariant = (index: number) => {
    const updatedVariants = newProduct.variants.filter((_, i) => i !== index);
    onNewProductChange({
      ...newProduct,
      variants: updatedVariants,
    });
  };

  return (
    <>
      <Modal isOpen={isAddModalOpen} onClose={onCloseAddModal}>
        <div className="max-h-[80vh] overflow-y-auto px-6 py-4">
          <h3 className="text-xl font-bold text-gray-900 mb-6">
            Create New Product
          </h3>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={newProduct.name}
                onChange={(e) =>
                  onNewProductChange({ ...newProduct, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={newProduct.category}
                onChange={(e) =>
                  onNewProductChange({
                    ...newProduct,
                    category: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={newProduct.description}
                onChange={(e) =>
                  onNewProductChange({
                    ...newProduct,
                    description: e.target.value,
                  })
                }
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Variants
                </label>
                <button
                  onClick={addVariant}
                  className="inline-flex items-center text-sm text-slate-900 hover:text-slate-800"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Variant
                </button>
              </div>

              <div className="space-y-4">
                {newProduct.variants.map((variant, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          SKU
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          value={variant.sku}
                          onChange={(e) =>
                            handleVariantChange(index, "sku", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Price
                        </label>
                        <input
                          type="number"
                          placeholder="price"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          value={variant.price}
                          onChange={(e) =>
                            handleVariantChange(index, "price", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Stock
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          value={variant.stock}
                          onChange={(e) =>
                            handleVariantChange(index, "stock", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Low Stock Threshold
                        </label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          value={variant.lowStockThreshold}
                          onChange={(e) =>
                            handleVariantChange(
                              index,
                              "lowStockThreshold",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Size
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          value={variant.attributes.size || ""}
                          onChange={(e) =>
                            handleAttributeChange(index, "size", e.target.value)
                          }
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-500 mb-1">
                          Color
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                          value={variant.attributes.color || ""}
                          onChange={(e) =>
                            handleAttributeChange(
                              index,
                              "color",
                              e.target.value,
                            )
                          }
                        />
                      </div>
                    </div>

                    {newProduct.variants.length > 1 && (
                      <button
                        onClick={() => removeVariant(index)}
                        className="mt-3 text-sm text-red-600 hover:text-red-800"
                      >
                        <Minus className="w-4 h-4 inline mr-1" />
                        Remove Variant
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onCreateProduct}
                className="flex-1 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                Create Product
              </button>
              <button
                onClick={onCloseAddModal}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <Modal isOpen={isSellModalOpen} onClose={onCloseSellModal}>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Sell Product</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity to Sell
              </label>
              <input
                type="number"
                min="1"
                value={sellQuantity}
                onChange={(e) => onSellQuantityChange(Number(e.target.value))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                disabled={selling}
                onClick={onConfirmSale}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {selling ? "Processing..." : "Confirm Sale"}
              </button>
              <button
                onClick={onCloseSellModal}
                className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </Modal>

      {viewProduct && (
        <Modal isOpen={!!viewProduct} onClose={onCloseViewModal}>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Edit Product
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Product Name
                </label>
                <input
                  value={viewProduct.name}
                  onChange={(e) =>
                    onViewProductChange({
                      ...viewProduct,
                      name: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <input
                  value={viewProduct.category}
                  onChange={(e) =>
                    onViewProductChange({
                      ...viewProduct,
                      category: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={onSaveViewProduct}
                  className="flex-1 bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={onCloseViewModal}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default ProductModals;
