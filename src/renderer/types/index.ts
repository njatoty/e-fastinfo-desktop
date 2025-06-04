export interface Product {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  imageUrl: string;
  price: number;
  stockQuantity: number;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface Category {
  id: string;
  name: string;
  description: string;
  color: string; // Hex color code for UI display
}

export interface CategoryCount {
  categoryId: string;
  categoryName: string;
  count: number;
}

export interface ProductStats {
  totalProducts: number;
  totalValue: number;
  lowStockItems: number;
  categoryCounts: CategoryCount[];
}

export interface StockMovement {
  id: string;
  productId: string;
  quantity: number; // Positive for stock in, negative for stock out
  note: string;
  userId: string;
  createdAt: string;
}

export interface StockUpdate {
  quantity: number;
  note: string;
}

export interface CSVExport {
  data: any[];
  filename: string;
  headers: string[];
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff';
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
}

export interface AppSettings {
  companyName: string;
  lowStockThreshold: number;
  defaultCurrency: string;
  emailNotifications: boolean;
  theme: 'light' | 'dark' | 'system';
  dateFormat: string;
  timeZone: string;
}