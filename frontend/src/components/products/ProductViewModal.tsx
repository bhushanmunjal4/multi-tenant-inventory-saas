import { useState, useEffect } from "react";
import { X, Edit2, Save, Plus, Trash2, AlertCircle } from "lucide-react";
import type { Product, Variant } from "../../types/product.ts";
import { useToast } from "../../context/ToastContext.tsx";
import { AxiosError } from "axios";

interface ProductViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSave: (product: Product) => Promise<void>;
}

const ProductViewModal = ({
  isOpen,
  onClose,
  product,
  onSave,
}: ProductViewModalProps) => {
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (product) {
      setEditedProduct(JSON.parse(JSON.stringify(product)));
      setIsEditing(false);
    }
  }, [product]);

  if (!isOpen || !product || !editedProduct) return null;

  const handleSave = async () => {
    try {
      setSaving(true);
      await onSave(editedProduct);
      setIsEditing(false);
    } catch (error) {
      if (error instanceof AxiosError) {
        showToast("Error saving product:");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedProduct(JSON.parse(JSON.stringify(product)));
    setIsEditing(false);
  };

  const handleAddVariant = () => {
    setEditedProduct({
      ...editedProduct,
      variants: [
        ...editedProduct.variants,
        {
          _id: `temp-${Date.now()}`,
          sku: "",
          price: 0,
          stock: 0,
          lowStockThreshold: 5,
          attributes: { size: "", color: "" },
        },
      ],
    });
  };

  const handleDeleteVariant = (variantId: string) => {
    setEditedProduct({
      ...editedProduct,
      variants: editedProduct.variants.filter((v) => v._id !== variantId),
    });
  };

  const updateVariant = (
    variantId: string,
    field: keyof Variant | string,
    value: any,
  ) => {
    setEditedProduct({
      ...editedProduct,
      variants: editedProduct.variants.map((variant) => {
        if (variant._id === variantId) {
          if (field.startsWith("attributes.")) {
            const attrKey = field.split(".")[1];
            return {
              ...variant,
              attributes: {
                ...variant.attributes,
                [attrKey]: value,
              },
            };
          }
          return { ...variant, [field]: value };
        }
        return variant;
      }),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 flex-none">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? "Edit Product" : "Product Details"}
            </h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Basic Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Name
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProduct.name}
                      onChange={(e) =>
                        setEditedProduct({
                          ...editedProduct,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{product.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedProduct.category}
                      onChange={(e) =>
                        setEditedProduct({
                          ...editedProduct,
                          category: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-900">{product.category}</p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  {isEditing ? (
                    <textarea
                      value={editedProduct.description || ""}
                      onChange={(e) =>
                        setEditedProduct({
                          ...editedProduct,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-700">
                      {product.description || "No description provided"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Variants ({editedProduct.variants.length})
                </h3>
                {isEditing && (
                  <button
                    onClick={handleAddVariant}
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    Add Variant
                  </button>
                )}
              </div>

              <div className="space-y-3">
                {editedProduct.variants.map((variant, index) => (
                  <div
                    key={variant._id}
                    className="bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-1 rounded">
                          Variant {index + 1}
                        </span>
                        {variant.stock <= variant.lowStockThreshold && (
                          <span className="flex items-center gap-1 bg-red-100 text-red-700 text-xs font-semibold px-2 py-1 rounded">
                            <AlertCircle className="w-3 h-3" />
                            Low Stock
                          </span>
                        )}
                      </div>
                      {isEditing && editedProduct.variants.length > 1 && (
                        <button
                          onClick={() => handleDeleteVariant(variant._id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete variant"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          SKU
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={variant.sku}
                            onChange={(e) =>
                              updateVariant(variant._id, "sku", e.target.value)
                            }
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-sm font-medium text-gray-900">
                            {variant.sku}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Price
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={variant.price}
                            onChange={(e) =>
                              updateVariant(
                                variant._id,
                                "price",
                                Number(e.target.value),
                              )
                            }
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-sm font-medium text-gray-900">
                            ₹{variant.price}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Stock
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={variant.stock}
                            onChange={(e) =>
                              updateVariant(
                                variant._id,
                                "stock",
                                Number(e.target.value),
                              )
                            }
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p
                            className={`text-sm font-medium ${
                              variant.stock <= variant.lowStockThreshold
                                ? "text-red-600"
                                : "text-green-600"
                            }`}
                          >
                            {variant.stock}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Low Stock Alert
                        </label>
                        {isEditing ? (
                          <input
                            type="number"
                            value={variant.lowStockThreshold}
                            onChange={(e) =>
                              updateVariant(
                                variant._id,
                                "lowStockThreshold",
                                Number(e.target.value),
                              )
                            }
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">
                            {variant.lowStockThreshold}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Size
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={variant.attributes.size || ""}
                            onChange={(e) =>
                              updateVariant(
                                variant._id,
                                "attributes.size",
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">
                            {variant.attributes.size || "—"}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Color
                        </label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={variant.attributes.color || ""}
                            onChange={(e) =>
                              updateVariant(
                                variant._id,
                                "attributes.color",
                                e.target.value,
                              )
                            }
                            className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-sm text-gray-900">
                            {variant.attributes.color || "—"}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 flex-none">
            <button
              onClick={handleCancel}
              disabled={saving}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductViewModal;
