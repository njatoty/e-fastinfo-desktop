import { createContext, useContext, useState, useEffect } from 'react';
import { ProductStats, StockMovement, StockUpdate } from '@/types';
import { useAuth } from '@/context/auth-context';
import { productService } from '@/components/services/product.service';
import type { Prisma, Product, Category } from '@prisma/client';
import { categoryService } from '@/components/services/category.service';

interface ProductContextType {
  products: Product[];
  categories: Category[];
  stats: ProductStats;
  stockMovements: StockMovement[];
  loading: boolean;
  addProduct: (product: Prisma.ProductCreateInput) => Promise<void>;
  updateProduct: (
    id: string,
    product: Prisma.ProductUpdateInput
  ) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  addCategory: (category: Prisma.CategoryCreateInput) => Promise<void>;
  updateCategory: (
    id: string,
    category: Prisma.CategoryUpdateInput
  ) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getProductsByCategory: (categoryId: string) => Product[];
  getProductsWithLowStock: (threshold?: number) => Product[];
  searchProducts: (query: string) => Product[];
  updateStock: (
    productId: string,
    update: Prisma.ProductUpdateInput
  ) => Promise<void>;
  getStockMovements: (productId?: string) => StockMovement[];
  exportToCSV: (type: 'products' | 'stock-movements') => void;
  bulkUpdateStock: (updates: { productId: string; quantity: number }[]) => void;
}

const ProductContext = createContext<ProductContextType | null>(null);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const [{ data: productsData }, { data: categoriesData }] =
        await Promise.all([productService.getAll(), categoryService.getAll()]);

      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (productsData) {
        setProducts(productsData);
        localStorage.setItem(
          'electronics-products',
          JSON.stringify(productsData)
        );
      }

      if (categoriesData) {
        setCategories(categoriesData);
        localStorage.setItem(
          'electronics-categories',
          JSON.stringify(categoriesData)
        );
      }

      if (true) {
        setStockMovements([]);
        localStorage.setItem('electronics-stock-movements', JSON.stringify([]));
      }

      setLoading(false);
    };

    loadData();
  }, []);

  const stats: ProductStats = {
    totalProducts: products.length,
    totalValue: products.reduce(
      (sum, product) => sum + product.price.toNumber() * product.stockQuantity,
      0
    ),
    lowStockItems: products.filter((p) => p.stockQuantity < 5).length,
    categoryCounts: categories.map((category) => ({
      categoryId: category.id,
      categoryName: category.name,
      count: products.filter((p) => p.categoryId === category.id).length,
    })),
  };

  // Existing CRUD operations...
  const addProduct = async (productData: Prisma.ProductCreateInput) => {
    const response = await productService.create(productData);

    if (response.data) {
      const newProduct = response.data;
      const updatedProducts = [...products, newProduct];
      setProducts(updatedProducts);
      localStorage.setItem(
        'electronics-products',
        JSON.stringify(updatedProducts)
      );
    }
  };

  const updateProduct = async (
    id: string,
    productData: Prisma.ProductUpdateInput
  ) => {
    const response = await productService.update(id, productData);

    if (response.data) {
      const updatedProducts = products.map((product) =>
        product.id === id ? { ...product, ...response.data } : product
      );
      setProducts(updatedProducts);
      localStorage.setItem(
        'electronics-products',
        JSON.stringify(updatedProducts)
      );
    }
  };

  const deleteProduct = async (id: string) => {
    const response = await productService.delete(id);
    if (response.data) {
      const updatedProducts = products.filter((product) => product.id !== id);
      setProducts(updatedProducts);
      localStorage.setItem(
        'electronics-products',
        JSON.stringify(updatedProducts)
      );
    }
  };

  const addCategory = async (categoryData: Prisma.CategoryCreateInput) => {
    const response = await categoryService.create(categoryData);
    if (response.data) {
      const updatedCategories = [...categories, response.data];
      setCategories(updatedCategories);
      localStorage.setItem(
        'electronics-categories',
        JSON.stringify(updatedCategories)
      );
    }
  };

  const updateCategory = async (
    id: string,
    categoryData: Prisma.CategoryUpdateInput
  ) => {
    const response = await categoryService.update(id, categoryData);
    if (response.data) {
      const updatedCategories = categories.map((category) =>
        category.id === id ? { ...category, ...response.data } : category
      );
      setCategories(updatedCategories);
      localStorage.setItem(
        'electronics-categories',
        JSON.stringify(updatedCategories)
      );
    }
  };

  const deleteCategory = async (id: string) => {
    const response = await categoryService.delete(id);
    if (response.data) {
      const productsWithCategory = products.filter(
        (product) => product.categoryId === id
      );
      if (productsWithCategory.length > 0) {
        throw new Error(
          `Cannot delete category with ${productsWithCategory.length} associated products`
        );
      }

      const updatedCategories = categories.filter(
        (category) => category.id !== id
      );
      setCategories(updatedCategories);
      localStorage.setItem(
        'electronics-categories',
        JSON.stringify(updatedCategories)
      );
    }
  };

  const getProductsByCategory = (categoryId: string) => {
    return products.filter((product) => product.categoryId === categoryId);
  };

  const getProductsWithLowStock = (threshold = 5) => {
    return products.filter((product) => product.stockQuantity < threshold);
  };

  const searchProducts = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return products.filter(
      (product) =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery)
    );
  };

  // New inventory management functions
  const updateStock = async (
    productId: string,
    update: Prisma.ProductUpdateInput
  ) => {
    const response = await productService.update(productId, update);

    if (response.data) {
      const product = products.find((p) => p.id === productId);
      if (!product) return;

      const newQuantity =
        product.stockQuantity + (update.stockQuantity as number);
      if (newQuantity < 0) {
        throw new Error('Cannot reduce stock below 0');
      }

      // Update product stock
      const updatedProducts = products.map((p) =>
        p.id === productId
          ? {
              ...p,
              ...response.data,
            }
          : p
      );
      setProducts(updatedProducts);
      localStorage.setItem(
        'electronics-products',
        JSON.stringify(updatedProducts)
      );

      // // Record stock movement
      // const movement: StockMovement = {
      //   id: `mov-${Date.now()}`,
      //   productId,
      //   quantity: update.stockQuantity as number,
      //   note: update.note,
      //   userId: user?.id || 'unknown',
      //   createdAt: new Date().toISOString(),
      // };

      // const updatedMovements = [...stockMovements, movement];
      // setStockMovements(updatedMovements);
      // localStorage.setItem(
      //   'electronics-stock-movements',
      //   JSON.stringify(updatedMovements)
      // );
    }
  };

  const getStockMovements = (productId?: string) => {
    return productId
      ? stockMovements.filter((m) => m.productId === productId)
      : stockMovements;
  };

  const exportToCSV = (type: 'products' | 'stock-movements') => {
    const data = type === 'products' ? products : stockMovements;
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map((item) =>
        headers
          .map((header) => JSON.stringify(item[header as keyof typeof item]))
          .join(',')
      ),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${type}-${new Date().toISOString()}.csv`;
    link.click();
  };

  const bulkUpdateStock = (
    updates: { productId: string; quantity: number }[]
  ) => {
    const updatedProducts = [...products];
    const newMovements: StockMovement[] = [];

    updates.forEach((update) => {
      const productIndex = updatedProducts.findIndex(
        (p) => p.id === update.productId
      );
      if (productIndex === -1) return;

      const product = updatedProducts[productIndex];
      const newQuantity = product.stockQuantity + update.quantity;

      if (newQuantity < 0) {
        throw new Error(
          `Cannot reduce stock below 0 for product: ${product.name}`
        );
      }

      updatedProducts[productIndex] = {
        ...product,
        stockQuantity: newQuantity,
        updatedAt: new Date(),
      };

      newMovements.push({
        id: `mov-${Date.now()}-${product.id}`,
        productId: product.id,
        quantity: update.quantity,
        note: 'Bulk update',
        userId: user?.id || 'unknown',
        createdAt: new Date().toISOString(),
      });
    });

    setProducts(updatedProducts);
    localStorage.setItem(
      'electronics-products',
      JSON.stringify(updatedProducts)
    );

    const updatedMovements = [...stockMovements, ...newMovements];
    setStockMovements(updatedMovements);
    localStorage.setItem(
      'electronics-stock-movements',
      JSON.stringify(updatedMovements)
    );
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        stats,
        stockMovements,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        addCategory,
        updateCategory,
        deleteCategory,
        getProductsByCategory,
        getProductsWithLowStock,
        searchProducts,
        updateStock,
        getStockMovements,
        exportToCSV,
        bulkUpdateStock,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};
