import type { Staff, Prisma } from '@prisma/client';
import { prisma, handleServiceError } from './utils';

// ============================================================================
// STAFF SERVICE
// ============================================================================
export const staffService = {
  /**
   * Retrieves all staff members.
   */
  getAll: async (): Promise<{ data: Staff[] | null; error: string | null }> => {
    try {
      const staff = await prisma.staff.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return { data: staff, error: null };
    } catch (error) {
      return handleServiceError(error, 'staffService.getAll');
    }
  },

  /**
   * Retrieves a single staff member by their ID.
   * @param {string} id - The UUID of the staff member.
   */
  getById: async (
    id: string
  ): Promise<{ data: Staff | null; error: string | null }> => {
    try {
      const staffMember = await prisma.staff.findUnique({
        where: { id },
        include: {
          managedProducts: true,
          managedCategories: true,
          processedOrders: true,
        },
      });
      return { data: staffMember, error: null };
    } catch (error) {
      return handleServiceError(error, 'staffService.getById');
    }
  },

  /**
   * Find staffs by filtering with query
   */
  findStaffs: async (
    filter: Prisma.StaffWhereInput
  ): Promise<{ data: Staff[] | null; error: string | null }> => {
    try {
      const staffMember = await prisma.staff.findMany({
        where: { ...filter },
        include: {
          managedProducts: true,
          managedCategories: true,
          processedOrders: true,
        },
      });
      return { data: staffMember, error: null };
    } catch (error) {
      return handleServiceError(error, 'staffService.getById');
    }
  },

  /**
   * Creates a new staff member.
   * NOTE: Password should be hashed *before* being passed to this function.
   * @param {object} staffData - Data for the new staff member.
   */
  create: async (
    staffData: Prisma.StaffCreateInput
  ): Promise<{ data: Staff | null; error: string | null }> => {
    try {
      const newStaffMember = await prisma.staff.create({
        data: staffData,
      });
      return { data: newStaffMember, error: null };
    } catch (error) {
      return handleServiceError(error, 'staffService.create');
    }
  },

  /**
   * Updates an existing staff member.
   * @param {string} id - The UUID of the staff member to update.
   * @param {object} updateData - The data to update.
   */
  update: async (
    id: Staff['id'],
    updateData: Prisma.StaffUpdateInput
  ): Promise<{ data: Staff | null; error: string | null }> => {
    try {
      const updatedStaffMember = await prisma.staff.update({
        where: { id },
        data: updateData,
      });
      return { data: updatedStaffMember, error: null };
    } catch (error) {
      return handleServiceError(error, 'staffService.update');
    }
  },

  /**
   * Deletes a staff member.
   * @param {string} id - The UUID of the staff member to delete.
   */
  delete: async (
    id: Staff['id']
  ): Promise<{ data: Staff | null; error: string | null }> => {
    try {
      const deletedStaffMember = await prisma.staff.delete({
        where: { id },
      });
      return { data: deletedStaffMember, error: null };
    } catch (error) {
      return handleServiceError(error, 'staffService.delete');
    }
  },
};
