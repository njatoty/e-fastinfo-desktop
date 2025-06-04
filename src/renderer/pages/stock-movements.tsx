import { useState } from 'react';
import { format } from 'date-fns';
import { Download, Filter, ArrowUpDown, User, Package, Calendar } from 'lucide-react';
import { useProducts } from '@/context/product-context';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function StockMovementsPage() {
  const { products, stockMovements, exportToCSV } = useProducts();
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [sortOption, setSortOption] = useState<'date-desc' | 'date-asc'>('date-desc');
  
  let filteredMovements = selectedProduct === 'all'
    ? stockMovements
    : stockMovements.filter(movement => movement.productId === selectedProduct);
  
  // Apply sorting
  filteredMovements.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOption === 'date-desc' ? dateB - dateA : dateA - dateB;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Stock Movements</h2>
          <p className="text-muted-foreground">
            Track all inventory changes
          </p>
        </div>
        
        <Button onClick={() => exportToCSV('stock-movements')}>
          <Download className="mr-2 h-4 w-4" />
          Export to CSV
        </Button>
      </div>
      
      <div className="flex gap-2">
        <Select
          value={selectedProduct}
          onValueChange={setSelectedProduct}
        >
          <SelectTrigger className="w-[250px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Filter by product" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Products</SelectItem>
            {products.map((product) => (
              <SelectItem key={product.id} value={product.id}>
                {product.name}
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
            <SelectItem value="date-desc">Newest First</SelectItem>
            <SelectItem value="date-asc">Oldest First</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="rounded-md border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="py-3 px-4 text-left font-medium">Date</th>
                <th className="py-3 px-4 text-left font-medium">Product</th>
                <th className="py-3 px-4 text-left font-medium">Quantity Change</th>
                <th className="py-3 px-4 text-left font-medium">Note</th>
                <th className="py-3 px-4 text-left font-medium">User</th>
              </tr>
            </thead>
            <tbody>
              {filteredMovements.length > 0 ? (
                filteredMovements.map((movement) => {
                  const product = products.find(p => p.id === movement.productId);
                  
                  return (
                    <tr key={movement.id} className="border-b last:border-b-0">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{format(new Date(movement.createdAt), 'MMM d, yyyy HH:mm')}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>{product?.name || 'Unknown Product'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${
                          movement.quantity > 0 
                            ? 'text-emerald-500' 
                            : 'text-rose-500'
                        }`}>
                          {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {movement.note}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Admin</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-muted-foreground">
                    No stock movements found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}