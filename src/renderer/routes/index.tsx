import { Navigate, Routes, Route } from 'react-router-dom';
import { useAuth } from '@/context/auth-context';
import { AppLayout } from '@/components/layout/app-layout';
import { LoginPage } from '@/pages/login';
import { DashboardPage } from '@/pages/dashboard';
import { ProductsPage } from '@/pages/products';
import { ProductDetailPage } from '@/pages/product-detail';
import { AddProductPage } from '@/pages/add-product';
import { EditProductPage } from '@/pages/edit-product';
import { CategoriesPage } from '@/pages/categories';
import { LowStockPage } from '@/pages/low-stock';
import { StockMovementsPage } from '@/pages/stock-movements';
import { StaffPage } from '@/pages/staff';
import { SettingsPage } from '@/pages/settings';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />

      <Route path="/" element={
        <ProtectedRoute>
          <AppLayout />
        </ProtectedRoute>
      }>
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/add" element={<AddProductPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="products/:id/edit" element={<EditProductPage />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="low-stock" element={<LowStockPage />} />
        <Route path="stock-movements" element={<StockMovementsPage />} />
        <Route path="staff" element={<StaffPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};