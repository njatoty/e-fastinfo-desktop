import type { Product, Category, Prisma } from '@prisma/client';
import { prisma, handleServiceError } from './utils';

export type ProductWithCategory = Product & { category: Category };
// ============================================================================
// PRODUCT SERVICE
// ============================================================================
export const productService = {
  /**
   * Retrieves all products with their category.
   */
  getAll: async (): Promise<{
    data: Product[] | null;
    error: string | null;
  }> => {
    try {
      const products = await prisma.product.findMany({
        include: { category: true, managingStaff: true, discounts: true },
        orderBy: { createdAt: 'desc' },
      });
      return { data: products, error: null };
    } catch (error) {
      return handleServiceError(error, 'productService.getAll');
    }
  },

  /**
   * Retrieves a single product by its ID.
   * @param id - The UUID of the product.
   */
  getById: async (id: string) => {
    try {
      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          category: true,
          managingStaff: true,
          discounts: true,
        },
      });
      return { data: product, error: null };
    } catch (error) {
      return handleServiceError(error, 'productService.getById');
    }
  },

  /**
   * Creates a new product.
   * @param productData - Data for the new product.
   */
  create: async (productData: Prisma.ProductCreateInput) => {
    try {
      const newProduct = await prisma.product.create({
        data: productData,
        include: {
          category: true,
          managingStaff: true,
          discounts: true,
        },
      });
      return { data: newProduct, error: null };
    } catch (error) {
      return handleServiceError(error, 'productService.create');
    }
  },

  /**
   * Updates an existing product.
   * @param id - The UUID of the product to update.
   * @param updateData - The data to update.
   */
  update: async (id: string, updateData: Prisma.ProductUpdateInput) => {
    try {
      const updatedProduct = await prisma.product.update({
        where: { id },
        data: updateData,
        include: {
          category: true,
          managingStaff: true,
          discounts: true,
        },
      });
      return { data: updatedProduct, error: null };
    } catch (error) {
      return handleServiceError(error, 'productService.update');
    }
  },

  /**
   * Deletes a product.
   * @param id - The UUID of the product to delete.
   */
  delete: async (
    id: string
  ): Promise<{ data: ProductWithCategory | null; error: string | null }> => {
    try {
      const deletedProduct = await prisma.product.delete({
        where: { id },
        include: {
          category: true,
          managingStaff: true,
          discounts: true,
        },
      });
      return { data: deletedProduct, error: null };
    } catch (error) {
      return handleServiceError(error, 'productService.delete');
    }
  },

  /**
   * Searches for products by name or description.
   * @param searchTerm - The term to search for.
   */
  search: async (searchTerm: string) => {
    try {
      const products = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: searchTerm } },
            { description: { contains: searchTerm } },
          ],
        },
        include: {
          category: true,
          managingStaff: true,
          discounts: true,
        },
      });

      return { data: products, error: null };
    } catch (error) {
      return handleServiceError(error, 'productService.search');
    }
  },
};
