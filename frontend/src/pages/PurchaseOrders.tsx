import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/useAuth";
import Modal from "../components/ui/Modal";
import { useToast } from "../context/ToastContext";
import { AxiosError } from "axios";
import { Truck, Package, Calendar, Building2 } from "lucide-react";
import Pagination from "../components/products/Pagination";
import {
  createPurchaseOrder,
  fetchProductsBasic,
  fetchPurchaseOrders,
  fetchSuppliers,
  receivePurchaseOrder,
} from "../services/purchaseOrder.service";

interface POItem {
  productId: string;
  variantId: string;
  orderedQty: number;
  receivedQty?: number;
  price: number;
}

interface PurchaseOrder {
  _id: string;
  supplierId: string;
  status: string;
  expectedDate: string;
  items: POItem[];
}

interface Supplier {
  _id: string;
  name: string;
}

interface Product {
  _id: string;
  name: string;
  variants: {
    _id: string;
    sku: string;
  }[];
}

const PurchaseOrders = () => {
  const { showToast } = useToast();
  const { user } = useAuth();

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentItem, setCurrentItem] = useState<POItem>({
    productId: "",
    variantId: "",
    orderedQty: 0,
    price: 0,
  });

  const [receiveModalOpen, setReceiveModalOpen] = useState(false);
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [receiveItems, setReceiveItems] = useState<
    { variantId: string; receiveQty: number }[]
  >([]);
  const [receiving, setReceiving] = useState(false);

  const [newPO, setNewPO] = useState({
    supplierId: "",
    expectedDate: "",
    items: [] as POItem[],
  });

  const fetchData = async () => {
    try {
      const [poData, supplierData, productData] = await Promise.all([
        fetchPurchaseOrders(),
        fetchSuppliers(),
        fetchProductsBasic(),
      ]);

      setPurchaseOrders(poData);
      setSuppliers(supplierData);
      setProducts(productData);
    } catch (error) {
      if (error instanceof AxiosError) {
        showToast("Error fetching PO data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getSupplierName = (supplierId: string) => {
    const supplier = suppliers.find((s) => s._id === supplierId);
    return supplier?.name || "Unknown Supplier";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RECEIVED":
        return "bg-green-50 text-green-700";
      case "CONFIRMED":
        return "bg-blue-50 text-blue-700";
      default:
        return "bg-yellow-50 text-yellow-700";
    }
  };

  const getTotalOrderValue = (items: POItem[]) => {
    return items.reduce(
      (total, item) => total + item.orderedQty * item.price,
      0,
    );
  };

  if (loading) {
    return (
      <Layout>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">
              Loading purchase orders...
            </span>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 h-full flex flex-col">
        <div className="flex justify-between items-center flex-none">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Purchase Orders
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage supplier orders and inventory replenishment
            </p>
          </div>
          {(user?.role === "OWNER" || user?.role === "MANAGER") && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors shadow-sm hover:shadow-md"
            >
              <Truck className="w-4 h-4 mr-2" />
              Create Purchase Order
            </button>
          )}
        </div>

        <div className="flex-1 min-h-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full min-h-0">
            <div className="flex-none border-b border-gray-200 bg-gray-50 rounded-t-xl">
              <div className="grid grid-cols-12 gap-4 px-6 py-3.5">
                <div className="col-span-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Supplier
                </div>
                <div className="col-span-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </div>
                <div className="col-span-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Expected Date
                </div>
                <div className="col-span-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Items
                </div>
                <div className="col-span-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total Value
                </div>
                <div className="col-span-1 text-xs font-semibold text-gray-600 uppercase tracking-wider text-right">
                  Actions
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
              {purchaseOrders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Package className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg font-medium">
                    No purchase orders found
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Create your first purchase order to get started
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {purchaseOrders.map((po) => (
                    <div
                      key={po._id}
                      className="group hover:bg-gray-50 transition-colors"
                    >
                      <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                        <div className="col-span-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center mr-3">
                              <Building2 className="w-4 h-4 text-indigo-600" />
                            </div>
                            <span className="font-semibold text-gray-900 text-sm">
                              {getSupplierName(po.supplierId)}
                            </span>
                          </div>
                        </div>

                        <div className="col-span-2">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(po.status)}`}
                          >
                            {po.status}
                          </span>
                        </div>

                        <div className="col-span-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                            {new Date(po.expectedDate).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              },
                            )}
                          </div>
                        </div>

                        <div className="col-span-2">
                          <span className="inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                            {po.items.length}{" "}
                            {po.items.length === 1 ? "Item" : "Items"}
                          </span>
                        </div>

                        <div className="col-span-2">
                          <span className="text-sm font-semibold text-gray-900">
                            ₹{getTotalOrderValue(po.items).toLocaleString()}
                          </span>
                        </div>

                        <div className="col-span-1 flex items-center justify-end gap-2">
                          {po.status !== "RECEIVED" && (
                            <button
                              onClick={() => {
                                setSelectedPO(po);
                                setReceiveItems(
                                  po.items.map((item) => ({
                                    variantId: item.variantId,
                                    receiveQty: 0,
                                  })),
                                );
                                setReceiveModalOpen(true);
                              }}
                              className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs font-medium rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer"
                              title="Receive items"
                            >
                              Receive
                            </button>
                          )}
                          {po.status === "RECEIVED" && (
                            <span className="text-xs text-gray-400 italic">
                              Completed
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {purchaseOrders.length > 0 && (
              <div className="flex-none border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <Pagination
                  currentPage={1}
                  totalPages={1}
                  totalItems={purchaseOrders.length}
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

        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Create Purchase Order
            </h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Supplier
                </label>
                <select
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newPO.supplierId}
                  onChange={(e) =>
                    setNewPO({ ...newPO, supplierId: e.target.value })
                  }
                >
                  <option value="">Choose a supplier</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier._id} value={supplier._id}>
                      {supplier.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expected Delivery Date
                </label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={newPO.expectedDate}
                  onChange={(e) =>
                    setNewPO({ ...newPO, expectedDate: e.target.value })
                  }
                />
              </div>

              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <h4 className="font-semibold text-gray-900 mb-4">Add Items</h4>

                <div className="space-y-4">
                  <select
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={currentItem.productId}
                    onChange={(e) =>
                      setCurrentItem({
                        ...currentItem,
                        productId: e.target.value,
                        variantId: "",
                      })
                    }
                  >
                    <option value="">Select Product</option>
                    {Array.isArray(products) &&
                      products.map((product) => (
                        <option key={product._id} value={product._id}>
                          {product.name}
                        </option>
                      ))}
                  </select>

                  {currentItem.productId && (
                    <select
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={currentItem.variantId}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          variantId: e.target.value,
                        })
                      }
                    >
                      <option value="">Select Variant</option>
                      {Array.isArray(products) &&
                        products
                          .find((p) => p._id === currentItem.productId)
                          ?.variants?.map((variant) => (
                            <option key={variant._id} value={variant._id}>
                              {variant.sku}
                            </option>
                          ))}
                    </select>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    <input
                      type="number"
                      placeholder="Quantity"
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={currentItem.orderedQty || ""}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          orderedQty: Number(e.target.value),
                        })
                      }
                    />

                    <input
                      type="number"
                      placeholder="Unit Price (₹)"
                      className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={currentItem.price || ""}
                      onChange={(e) =>
                        setCurrentItem({
                          ...currentItem,
                          price: Number(e.target.value),
                        })
                      }
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (
                        currentItem.productId &&
                        currentItem.variantId &&
                        currentItem.orderedQty > 0 &&
                        currentItem.price > 0
                      ) {
                        setNewPO({
                          ...newPO,
                          items: [...newPO.items, currentItem],
                        });

                        setCurrentItem({
                          productId: "",
                          variantId: "",
                          orderedQty: 0,
                          price: 0,
                        });
                      }
                    }}
                    className="w-full bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    Add Item
                  </button>
                </div>
              </div>

              {newPO.items.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Items Added
                  </h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {newPO.items.map((item, index) => {
                      const product = products.find(
                        (p) => p._id === item.productId,
                      );
                      const variant = product?.variants.find(
                        (v) => v._id === item.variantId,
                      );

                      return (
                        <div
                          key={index}
                          className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                        >
                          <div>
                            <span className="font-medium text-sm text-gray-900">
                              {product?.name}
                            </span>
                            <span className="text-xs text-gray-500 block">
                              SKU: {variant?.sku}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-semibold text-gray-900">
                              Qty: {item.orderedQty}
                            </span>
                            <span className="text-xs text-gray-500 block">
                              ₹{item.price}/unit
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-blue-800">
                        Total Amount:
                      </span>
                      <span className="text-lg font-bold text-blue-800">
                        ₹
                        {newPO.items
                          .reduce(
                            (total, item) =>
                              total + item.orderedQty * item.price,
                            0,
                          )
                          .toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <button
                onClick={async () => {
                  try {
                    await createPurchaseOrder(newPO);
                    setIsModalOpen(false);
                    setNewPO({
                      supplierId: "",
                      expectedDate: "",
                      items: [],
                    });
                    await fetchData();
                    showToast("Purchase order created successfully", "success");
                  } catch (error: unknown) {
                    if (error instanceof AxiosError) {
                      showToast(
                        error.response?.data?.message || "Error creating PO",
                        "error",
                      );
                    } else {
                      showToast("Unexpected error occurred", "error");
                    }
                  }
                }}
                disabled={
                  !newPO.supplierId ||
                  !newPO.expectedDate ||
                  newPO.items.length === 0
                }
                className="w-full bg-green-600 text-white p-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Purchase Order
              </button>
            </div>
          </div>
        </Modal>

        <Modal
          isOpen={receiveModalOpen}
          onClose={() => setReceiveModalOpen(false)}
        >
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Receive Items
            </h3>
            <p className="text-sm text-gray-500 mb-6">
              PO #{selectedPO?._id.slice(-6)} -{" "}
              {selectedPO && getSupplierName(selectedPO.supplierId)}
            </p>

            <div className="space-y-4 max-h-96 overflow-y-auto">
              {selectedPO?.items.map((item, index) => {
                const product = products.find((p) =>
                  p.variants.some((v) => v._id === item.variantId),
                );
                const variant = product?.variants.find(
                  (v) => v._id === item.variantId,
                );

                return (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {product?.name}
                        </h4>
                        <p className="text-xs text-gray-500">
                          SKU: {variant?.sku}
                        </p>
                      </div>
                      <span className="text-xs font-medium bg-gray-100 px-2 py-1 rounded">
                        Ordered: {item.orderedQty}
                      </span>
                    </div>

                    {item.receivedQty ? (
                      <div className="text-sm text-gray-600 mb-2">
                        Already received: {item.receivedQty}
                      </div>
                    ) : null}

                    <input
                      type="number"
                      min="0"
                      max={item.orderedQty - (item.receivedQty || 0)}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter quantity to receive"
                      value={receiveItems[index]?.receiveQty || ""}
                      onChange={(e) => {
                        const updated = [...receiveItems];
                        updated[index].receiveQty = Number(e.target.value);
                        setReceiveItems(updated);
                      }}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Max: {item.orderedQty - (item.receivedQty || 0)}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setReceiveModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                disabled={
                  receiving || receiveItems.every((i) => i.receiveQty === 0)
                }
                onClick={async () => {
                  try {
                    setReceiving(true);
                    await receivePurchaseOrder(
                      selectedPO!._id,
                      receiveItems.filter((i) => i.receiveQty > 0),
                    );
                    setReceiveModalOpen(false);
                    await fetchData();
                    showToast("Items received successfully", "success");
                  } catch (error: unknown) {
                    if (error instanceof AxiosError) {
                      showToast(
                        error?.response?.data?.message ||
                          "Error receiving purchase order",
                        "error",
                      );
                    } else {
                      showToast("Unexpected error occurred", "error");
                    }
                  } finally {
                    setReceiving(false);
                  }
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {receiving ? "Processing..." : "Confirm Receive"}
              </button>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default PurchaseOrders;
