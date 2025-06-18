import { AppSettings, Prisma } from '@prisma/client';
import { prisma } from './utils';

export const SettingService = {
  // Get settings by staff ID
  async getSettingsByStaffId(staffId: string): Promise<AppSettings | null> {
    return await prisma.appSettings.findUnique({
      where: { staffId },
    });
  },

  // Create new settings for a staff
  async createSettings(
    data: Prisma.AppSettingsCreateInput
  ): Promise<AppSettings> {
    return await prisma.appSettings.create({
      data,
    });
  },

  // Update existing settings for a staff
  async updateSettings(
    staffId: string,
    data: Partial<AppSettings>
  ): Promise<AppSettings> {
    return await prisma.appSettings.update({
      where: { staffId },
      data,
    });
  },

  // Delete settings for a staff
  async deleteSettings(staffId: string): Promise<AppSettings> {
    return await prisma.appSettings.delete({
      where: { staffId },
    });
  },
};
