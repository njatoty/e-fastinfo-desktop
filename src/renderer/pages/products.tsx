import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  MoreHorizontal,
  Trash,
  Pencil,
  Eye,
  LayoutGrid,
  LayoutList,
} from 'lucide-react';
import { useProducts } from '@/context/product-context';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { ProductCard } from '@/components/product-card';
import { useLocalStorage } from '@/hooks/use-localstorage';
import { Card } from '@/components/ui/card';
import { IconValue } from '@/components/icon-picker';
import { toNumber } from '@/lib/utils';

type SortOption =
  | 'name-asc'
  | 'name-desc'
  | 'price-asc'
  | 'price-desc'
  | 'stock-asc'
  | 'stock-desc'
  | 'date-asc'
  | 'date-desc';
type ViewMode = 'grid' | 'table';

export function ProductsPage() {
  const { products, categories, deleteProduct, loading } = useProducts();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOption, setSortOption] = useLocalStorage<SortOption>(
    'products_table_sort',
    'name-asc'
  );
  const [viewMode, setViewMode] = useLocalStorage<ViewMode>(
    'products_table_view',
    'grid'
  );

  // Filter products based on search and category
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || product.categoryId === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  // Sort products
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'price-asc':
          return toNumber(a.price) - toNumber(b.price);
        case 'price-desc':
          return toNumber(b.price) - toNumber(a.price);
        case 'stock-asc':
          return a.stockQuantity - b.stockQuantity;
        case 'stock-desc':
          return b.stockQuantity - a.stockQuantity;
        case 'date-asc':
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case 'date-desc':
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

        default:
          return 0;
      }
    });
  }, [filteredProducts, sortOption]);

  const handleDelete = useCallback(
    async (id: string, event: React.MouseEvent) => {
      event.stopPropagation();

      try {
        await deleteProduct(id); // ensure async/await
        toast.success('Product deleted successfully');
      } catch (error) {
        console.error(error);
        toast.error('Failed to delete product');
      }
    },
    [deleteProduct]
  );

  const handleEdit = useCallback(
    (id: string, event: React.MouseEvent) => {
      event.stopPropagation();
      navigate(`/products/${id}/edit`);
    },
    [navigate]
  );

  const handleView = useCallback(
    (id: string, event: React.MouseEvent) => {
      event.stopPropagation();
      navigate(`/products/${id}`);
    },
    [navigate]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        Loading...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">Manage your product inventory</p>
        </div>
        <Button onClick={() => navigate('/products/add')}>
          <Plus className="w-4 h-4 mr-2" /> Add Product
        </Button>
      </div>

      <Card className="flex flex-col gap-4 md:flex-row p-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
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
            onValueChange={(value) => setSortOption(value as SortOption)}
          >
            <SelectTrigger className="w-[180px]">
              <ArrowUpDown className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
              <SelectItem value="stock-asc">Stock (Low to High)</SelectItem>
              <SelectItem value="stock-desc">Stock (High to Low)</SelectItem>
              <SelectItem value="date-asc">
                Date Created (Oldest First)
              </SelectItem>
              <SelectItem value="date-desc">
                Date Created (Newest First)
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={() => setViewMode(viewMode === 'grid' ? 'table' : 'grid')}
          >
            {viewMode === 'grid' ? (
              <LayoutList className="w-4 h-4" />
            ) : (
              <LayoutGrid className="w-4 h-4" />
            )}
          </Button>
        </div>
      </Card>

      {viewMode === 'grid' ? (
        <div className="product-grid">
          {sortedProducts.map((product) => {
            return (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  price: product.price,
                }}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            );
          })}
        </div>
      ) : (
        <Card className="p-2">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/20">
                  <th className="px-4 py-3 font-medium text-left">Product</th>
                  <th className="px-4 py-3 font-medium text-left">Category</th>
                  <th className="px-4 py-3 font-medium text-left">Price</th>
                  <th className="px-4 py-3 font-medium text-left">Stock</th>
                  <th className="px-4 py-3 font-medium text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedProducts.length > 0 ? (
                  sortedProducts.map((product) => {
                    return (
                      <tr
                        key={product.id}
                        className="border-b cursor-pointer last:border-b-0 hover:bg-muted/50"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 bg-center bg-no-repeat bg-contain rounded"
                              style={{
                                backgroundImage: `url(${product.imageUrl})`,
                              }}
                            />
                            <span className="font-medium">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <IconValue icon={product.category.icon!} />
                            <span>{product.category.name || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          ${toNumber(product.price).toFixed(2)}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={
                              product.stockQuantity < 5
                                ? 'text-rose-500'
                                : product.stockQuantity < 10
                                ? 'text-amber-500'
                                : ''
                            }
                          >
                            {product.stockQuantity}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreHorizontal className="w-4 h-4" />
                                <span className="sr-only">Actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={(e) => handleView(product.id, e)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={(e) => handleEdit(product.id, e)}
                              >
                                <Pencil className="w-4 h-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={(e) => handleDelete(product.id, e)}
                              >
                                <Trash className="w-4 h-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="py-6 text-center text-muted-foreground"
                    >
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* No products */}
      {sortedProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground border border-dashed rounded-lg">
          <svg
            className="h-12 w-12 mb-4 text-gray-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 10h1m10 0h8m-8 4h8m-8 4h8m-8-8h8m-8-4h8M3 6h1m0 0v12m0-12h11m0 12H4m7-4h1"
            />
          </svg>
          <h3 className="text-lg font-semibold">No products found</h3>
          <p className="text-sm">Get started by adding your first product.</p>
          <Button className="mt-4" onClick={() => navigate('/products/add')}>
            Add Product
          </Button>
        </div>
      )}

      <div className="flex justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {sortedProducts.length} of {products.length} products
        </p>
      </div>
    </div>
  );
}
