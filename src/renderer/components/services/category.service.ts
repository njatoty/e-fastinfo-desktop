import type { Prisma } from '@prisma/client';
import { prisma, handleServiceError } from './utils';

// A custom type for the getAll response to include the product count
export type CategoryWithIncludes = Prisma.CategoryGetPayload<{
  include: {
    _count: {
      select: {
        products: true;
      };
    };
    managingStaff: true;
    discounts: true;
  };
}>;

// ============================================================================
// CATEGORY SERVICE
// ============================================================================
export const categoryService = {
  /**
   * Retrieves all categories including a count of their associated products.
   */
  getAll: async (): Promise<{
    data: CategoryWithIncludes[] | null;
    error: string | null;
  }> => {
    try {
      const categories = await prisma.category.findMany({
        include: {
          _count: {
            select: { products: true },
          },
          managingStaff: true,
          discounts: true,
        },
        orderBy: { name: 'asc' },
      });
      return { data: categories, error: null };
    } catch (error) {
      return handleServiceError(error, 'categoryService.getAll');
    }
  },

  /**
   * Retrieves a single category by its ID.
   * @param id - The UUID of the category.
   */
  getById: async (
    id: string
  ): Promise<{
    data: CategoryWithIncludes | null;
    error: string | null;
  }> => {
    try {
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          _count: {
            select: { products: true },
          },
          managingStaff: true,
          discounts: true,
        },
      });
      return { data: category, error: null };
    } catch (error) {
      return handleServiceError(error, 'categoryService.getById');
    }
  },

  /**
   * Creates a new category.
   * @param categoryData - Data for the new category.
   */
  create: async (
    categoryData: Prisma.CategoryCreateInput
  ): Promise<{ data: CategoryWithIncludes | null; error: string | null }> => {
    try {
      const newCategory = await prisma.category.create({
        data: categoryData,
        include: {
          _count: {
            select: { products: true },
          },
          managingStaff: true,
          discounts: true,
        },
      });
      return { data: newCategory, error: null };
    } catch (error) {
      return handleServiceError(error, 'categoryService.create');
    }
  },

  /**
   * Updates an existing category.
   * @param id - The UUID of the category to update.
   * @param updateData - The data to update.
   */
  update: async (
    id: string,
    updateData: Prisma.CategoryUpdateInput
  ): Promise<{ data: CategoryWithIncludes | null; error: string | null }> => {
    try {
      const updatedCategory = await prisma.category.update({
        where: { id },
        data: updateData,
        include: {
          _count: {
            select: { products: true },
          },
          managingStaff: true,
          discounts: true,
        },
      });
      return { data: updatedCategory, error: null };
    } catch (error) {
      return handleServiceError(error, 'categoryService.update');
    }
  },

  /**
   * Deletes a category.
   * @param id - The UUID of the category to delete.
   */
  delete: async (
    id: string
  ): Promise<{ data: CategoryWithIncludes | null; error: string | null }> => {
    try {
      const productCount = await prisma.product.count({
        where: { categoryId: id },
      });
      if (productCount > 0) {
        throw new Error(
          `Cannot delete category: ${productCount} product(s) are still associated with it.`
        );
      }
      const deletedCategory = await prisma.category.delete({
        where: { id },
        include: {
          _count: {
            select: { products: true },
          },
          managingStaff: true,
          discounts: true,
        },
      });
      return { data: deletedCategory, error: null };
    } catch (error) {
      return handleServiceError(error, 'categoryService.delete');
    }
  },
};
