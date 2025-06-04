import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, ArrowUpDown, Filter } from 'lucide-react';
import { useProducts } from '@/context/product-context';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export function LowStockPage() {
  const { products, categories, getProductsWithLowStock } = useProducts();
  const navigate = useNavigate();
  
  const [threshold, setThreshold] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useState<'stock-asc' | 'stock-desc' | 'name-asc' | 'name-desc'>('stock-asc');
  
  let lowStockProducts = getProductsWithLowStock(threshold);
  
  // Apply category filter
  if (selectedCategory !== 'all') {
    lowStockProducts = lowStockProducts.filter(product => product.categoryId === selectedCategory);
  }
  
  // Apply sorting
  lowStockProducts.sort((a, b) => {
    switch (sortOption) {
      case 'stock-asc':
        return a.stockQuantity - b.stockQuantity;
      case 'stock-desc':
        return b.stockQuantity - a.stockQuantity;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Low Stock Products</h2>
        <p className="text-muted-foreground">
          Monitor and manage products with low inventory
        </p>
      </div>
      
      <div className="flex flex-col gap-4 md:flex-row">
        <div className="flex-1">
          <label className="text-sm font-medium">Stock Threshold</label>
          <Input
            type="number"
            min="1"
            value={threshold}
            onChange={(e) => setThreshold(parseInt(e.target.value) || 1)}
            className="max-w-[200px]"
          />
        </div>
        
        <div className="flex gap-2">
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Select
            value={sortOption}
            onValueChange={(value: any) => setSortOption(value)}
          >
            <SelectTrigger className="w-[180px]">
              <ArrowUpDown className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stock-asc">Stock (Low to High)</SelectItem>
              <SelectItem value="stock-desc">Stock (High to Low)</SelectItem>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="py-3 px-4 text-left font-medium">Product</th>
                <th className="py-3 px-4 text-left font-medium">Category</th>
                <th className="py-3 px-4 text-left font-medium">Price</th>
                <th className="py-3 px-4 text-left font-medium">Stock</th>
                <th className="py-3 px-4 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {lowStockProducts.length > 0 ? (
                lowStockProducts.map((product) => {
                  const category = categories.find(c => c.id === product.categoryId);
                  const urgency = product.stockQuantity === 0 
                    ? 'Out of Stock' 
                    : product.stockQuantity < 3 
                      ? 'Critical' 
                      : 'Low';
                  
                  return (
                    <tr 
                      key={product.id} 
                      className="border-b last:border-b-0 hover:bg-muted/50 cursor-pointer"
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div 
                            className="h-10 w-10 rounded bg-cover bg-center bg-no-repeat" 
                            style={{ backgroundImage: `url(${product.imageUrl})` }}
                          />
                          <span className="font-medium">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div 
                            className="h-2 w-2 rounded-full" 
                            style={{ backgroundColor: category?.color || 'gray' }}
                          />
                          <span>{category?.name || 'Unknown'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">${product.price.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-rose-500">
                          {product.stockQuantity}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className={`h-4 w-4 ${
                            urgency === 'Out of Stock' 
                              ? 'text-rose-500' 
                              : urgency === 'Critical' 
                                ? 'text-amber-500' 
                                : 'text-yellow-500'
                          }`} />
                          <span className={`text-sm font-medium ${
                            urgency === 'Out of Stock' 
                              ? 'text-rose-500' 
                              : urgency === 'Critical' 
                                ? 'text-amber-500' 
                                : 'text-yellow-500'
                          }`}>
                            {urgency}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                    No products below the stock threshold
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          Showing {lowStockProducts.length} products below threshold
        </p>
        <Button onClick={() => navigate('/products/add')}>
          Order More Stock
        </Button>
      </div>
    </div>
  );
}