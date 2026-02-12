import { useEffect, useState } from "react";
import Layout from "../components/layout/Layout";
import { useAuth } from "../context/useAuth";
import Modal from "../components/ui/Modal";
import { useToast } from "../context/ToastContext";
import { Building2, Mail, Phone, MapPin, Plus, Building } from "lucide-react";
import Pagination from "../components/products/Pagination";
import { fetchSuppliers } from "../services/supplier.service";
import { AxiosError } from "axios";

interface Supplier {
  _id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

const Suppliers = () => {
  const { showToast } = useToast();
  const { user } = useAuth();
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  const [newSupplier, setNewSupplier] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const loadSuppliers = async () => {
    try {
      const data = await fetchSuppliers();
      setSuppliers(data);
    } catch (error) {
      if (error instanceof AxiosError) {
        showToast("Error fetching suppliers");
      }
      showToast("Error fetching suppliers", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSuppliers();
  });

  if (loading) {
    return (
      <Layout>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading suppliers...</span>
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
            <h2 className="text-2xl font-bold text-gray-900">Suppliers</h2>
            <p className="text-sm text-gray-500 mt-1">
              Manage your vendor and supplier information
            </p>
          </div>
          {(user?.role === "OWNER" || user?.role === "MANAGER") && (
            <button
              onClick={() => {
                setEditingSupplier(null);
                setNewSupplier({
                  name: "",
                  email: "",
                  phone: "",
                  address: "",
                });
                setIsModalOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors shadow-sm hover:shadow-md"
            >
              <Building className="w-4 h-4 mr-2" />
              Add Supplier
            </button>
          )}
        </div>

        <div className="flex-1 min-h-0">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col h-full min-h-0">
            <div className="flex-none border-b border-gray-200 bg-gray-50 rounded-t-xl">
              <div className="grid grid-cols-12 gap-4 px-6 py-3.5">
                <div className="col-span-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Supplier Name
                </div>
                <div className="col-span-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Email
                </div>
                <div className="col-span-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Phone
                </div>
                <div className="col-span-3 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Address
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400">
              {suppliers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Building2 className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg font-medium">
                    No suppliers found
                  </p>
                  <p className="text-gray-400 text-sm mt-1">
                    Add your first supplier to get started
                  </p>
                  {(user?.role === "OWNER" || user?.role === "MANAGER") && (
                    <button
                      onClick={() => {
                        setEditingSupplier(null);
                        setNewSupplier({
                          name: "",
                          email: "",
                          phone: "",
                          address: "",
                        });
                        setIsModalOpen(true);
                      }}
                      className="mt-4 inline-flex items-center px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Supplier
                    </button>
                  )}
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {suppliers.map((supplier) => (
                    <div
                      key={supplier._id}
                      className="group hover:bg-gray-50 transition-colors"
                    >
                      <div className="grid grid-cols-12 gap-4 px-6 py-4 items-center">
                        <div className="col-span-3">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-indigo-50 rounded-full flex items-center justify-center mr-3">
                              <Building2 className="w-4 h-4 text-indigo-600" />
                            </div>
                            <span className="font-semibold text-gray-900 text-sm">
                              {supplier.name}
                            </span>
                          </div>
                        </div>

                        <div className="col-span-3">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="truncate">{supplier.email}</span>
                          </div>
                        </div>

                        <div className="col-span-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone className="w-4 h-4 mr-2 text-gray-400" />
                            <span>{supplier.phone}</span>
                          </div>
                        </div>

                        <div className="col-span-3">
                          <div className="flex items-start text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2 text-gray-400 shrink-0 mt-0.5" />
                            <span className="line-clamp-2">
                              {supplier.address}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {suppliers.length > 0 && (
              <div className="flex-none border-t border-gray-200 bg-gray-50 rounded-b-xl">
                <Pagination
                  currentPage={1}
                  totalPages={1}
                  totalItems={suppliers.length}
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

        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingSupplier(null);
            setNewSupplier({
              name: "",
              email: "",
              phone: "",
              address: "",
            });
          }}
        >
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {editingSupplier ? "Edit Supplier" : "Create New Supplier"}
            </h3>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Supplier Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter supplier name"
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newSupplier.name}
                    onChange={(e) =>
                      setNewSupplier({
                        ...newSupplier,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="supplier@company.com"
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newSupplier.email}
                    onChange={(e) =>
                      setNewSupplier({
                        ...newSupplier,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={newSupplier.phone}
                    onChange={(e) =>
                      setNewSupplier({
                        ...newSupplier,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <textarea
                    placeholder="Enter complete address"
                    rows={3}
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    value={newSupplier.address}
                    onChange={(e) =>
                      setNewSupplier({
                        ...newSupplier,
                        address: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingSupplier(null);
                    setNewSupplier({
                      name: "",
                      email: "",
                      phone: "",
                      address: "",
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </Modal>
      </div>
    </Layout>
  );
};

export default Suppliers;
