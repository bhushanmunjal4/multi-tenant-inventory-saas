import { Response } from "express";
import { AuthRequest } from "../../middleware/auth.middleware";
import { createProduct, getLowStockProducts, getProductsByTenant, sellVariant } from "./product.service";
import { Product } from "./product.model";

export const createProductHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const tenantId = req.user!.tenantId;

    const productData = {
      ...req.body,
      tenantId
    };

    const product = await createProduct(productData);

    res.status(201).json({
      success: true,
      data: product
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getProductsHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const tenantId = req.user!.tenantId;

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const { products, total } = await getProductsByTenant(
      tenantId,
      skip,
      limit
    );

    res.status(200).json({
      success: true,
      data: {
        products,
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const getProductByIdHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const tenantId = req.user!.tenantId;
    const { productId } = req.params;

    const product = await Product.findOne({
      _id: productId,
      tenantId,
    }).lean();

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });

  } catch (error: unknown) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Internal server error",
    });
  }
};

export const updateProductHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const tenantId = req.user!.tenantId;
    const { productId } = req.params;

    const { name, description, category, variants } = req.body;

    const updated = await Product.findOneAndUpdate(
      { _id: productId, tenantId },
      {
        name,
        description,
        category,
        variants
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.json({
      success: true,
      data: updated,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};



export const sellVariantHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const productId = req.params.productId as string;
    const variantId = req.params.variantId as string;
    const { quantity } = req.body;

    const tenantId = req.user!.tenantId;

    const updatedProduct = await sellVariant(
      tenantId,
      productId,
      variantId,
      quantity
    );

    res.status(200).json({
      success: true,
      data: updatedProduct
    });

  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

export const getLowStockHandler = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const tenantId = req.user!.tenantId;

    const data = await getLowStockProducts(tenantId);

    res.status(200).json({
      success: true,
      data
    });

  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
