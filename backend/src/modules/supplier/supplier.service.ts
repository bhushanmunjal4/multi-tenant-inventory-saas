import { Supplier, ISupplier } from "./supplier.model";

export const createSupplier = async (
  supplierData: Partial<ISupplier>
) => {
  const supplier = await Supplier.create(supplierData);
  return supplier;
};

export const getSuppliersByTenant = async (tenantId: string) => {
  const suppliers = await Supplier.find({ tenantId }).lean();
  return suppliers;
};
