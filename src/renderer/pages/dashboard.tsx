import {
  ArrowDown,
  ArrowUp,
  Package,
  DollarSign,
  AlertTriangle,
  PieChart,
} from 'lucide-react';
import { useProducts } from '@/context/product-context';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RechartsBarChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toNumber } from '@/lib/utils';
import { IconValue } from '@/components/icon-picker';
import { useTranslation } from 'react-i18next';

export function DashboardPage() {
  const { products, categories, stats, loading } = useProducts();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const stockThreshbold = 5;

  // Get low stock products (stock < 5)
  const lowStockProducts = products.filter(
    (product) => product.stockQuantity < stockThreshbold
  );

  // Calculate some random stats for demo purposes
  const previousTotalValue = stats.totalValue * 0.85; // Fake previous value
  const valueChange = stats.totalValue - previousTotalValue;
  const valueChangePercent = (valueChange / previousTotalValue) * 100;

  const previousLowStock = 3; // Fake previous low stock count
  const lowStockChange = lowStockProducts.length - previousLowStock;

  // const inventoryData = categories.map((category) => ({
  //   name: category.name,
  //   value: products.filter((product) => product.categoryId === category.id)
  //     .length,
  //   icon: category.icon,
  // }));

  const priceRangeData = [
    {
      name: '$0-$99',
      count: products.filter((p) => toNumber(p.price) < 100).length,
    },
    {
      name: '$100-$299',
      count: products.filter(
        (p) => toNumber(p.price) >= 100 && toNumber(p.price) < 300
      ).length,
    },
    {
      name: '$300-$499',
      count: products.filter(
        (p) => toNumber(p.price) >= 300 && toNumber(p.price) < 500
      ).length,
    },
    {
      name: '$500+',
      count: products.filter((p) => toNumber(p.price) >= 500).length,
    },
  ];

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
          <h2 className="text-3xl font-bold tracking-tight">
            {t('dashboard.title')}
          </h2>
          <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
        </div>
        <Button onClick={() => navigate('/products/add')}>
          {t('products.actions.add')}
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Products Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.cards.activeProducts.title')}
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.cards.activeProducts.acrossCategory', {
                count: categories.length,
              })}
            </p>
          </CardContent>
        </Card>

        {/* Inventory Value Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.cards.inventoryValues.title')}
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {stats.totalValue.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}
            </div>
            <div className="flex items-center text-xs">
              {valueChange > 0 ? (
                <>
                  <ArrowUp className="mr-1 h-3 w-3 text-emerald-500" />
                  <span className="text-emerald-500">
                    {valueChangePercent.toFixed(1)}%
                  </span>
                </>
              ) : (
                <>
                  <ArrowDown className="mr-1 h-3 w-3 text-rose-500" />
                  <span className="text-rose-500">
                    {Math.abs(valueChangePercent).toFixed(1)}%
                  </span>
                </>
              )}
              <span className="ml-1 text-muted-foreground">
                {t('dashboard.cards.inventoryValues.change')}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alert Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.cards.lowStockItems.title')}
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowStockProducts.length}</div>
            <div className="flex items-center text-xs">
              {lowStockChange > 0 ? (
                <>
                  <ArrowUp className="mr-1 h-3 w-3 text-rose-500" />
                  <span className="text-rose-500">+{lowStockChange}</span>
                </>
              ) : lowStockChange < 0 ? (
                <>
                  <ArrowDown className="mr-1 h-3 w-3 text-emerald-500" />
                  <span className="text-emerald-500">{lowStockChange}</span>
                </>
              ) : (
                <span className="text-muted-foreground">No change</span>
              )}
              <span className="ml-1 text-muted-foreground">
                since yesterday
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Categories Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('dashboard.cards.totalCategories.title')}
            </CardTitle>
            <PieChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">
              {t('dashboard.cards.totalCategories.mostPopular', {
                category:
                  categories.length > 0
                    ? categories.reduce((prev, current) => {
                        const prevCount = products.filter(
                          (p) => p.categoryId === prev.id
                        ).length;
                        const currentCount = products.filter(
                          (p) => p.categoryId === current.id
                        ).length;
                        return prevCount > currentCount ? prev : current;
                      }).name
                    : 'None',
              })}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Products by Category Chart */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Products by Category</CardTitle>
            <CardDescription>
              Distribution of products across categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.categoryCounts} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis
                    dataKey="categoryName"
                    type="category"
                    width={100}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value} products`, 'Count']}
                    labelFormatter={(label) => `Category: ${label}`}
                  />
                  <Bar
                    dataKey="count"
                    fill="hsl(var(--primary))"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Price Distribution Chart */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Price Distribution</CardTitle>
            <CardDescription>Products by price range</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart width={400} height={300}>
                  <Pie
                    data={priceRangeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="count"
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {priceRangeData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        name={entry.name}
                        fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                      />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip
                    formatter={(value) => [`${value} products`, 'Count']}
                  />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Products List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" />
            {t('dashboard.cards.lowStockItems.title')}
          </CardTitle>
          <CardDescription>
            {t('dashboard.cards.lowStockItems.subtitle', {
              threshold: stockThreshbold,
            })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {lowStockProducts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="pb-2 text-left font-medium">
                      {t('products.table.headers.name')}
                    </th>
                    <th className="pb-2 text-left font-medium">
                      {t('products.table.headers.category')}
                    </th>
                    <th className="pb-2 text-left font-medium">
                      {t('products.table.headers.price')}
                    </th>
                    <th className="pb-2 text-right font-medium">
                      {t('products.table.headers.stock')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {lowStockProducts.map((product) => {
                    const category = categories.find(
                      (c) => c.id === product.categoryId
                    );
                    return (
                      <tr
                        key={product.id}
                        className="border-b last:border-b-0 hover:bg-muted/50 cursor-pointer"
                        onClick={() => navigate(`/products/${product.id}`)}
                      >
                        <td className="py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="h-8 w-8 rounded bg-cover bg-center bg-no-repeat"
                              style={{
                                backgroundImage: `url(${product.imageUrl})`,
                              }}
                            />
                            <span className="font-medium">{product.name}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <IconValue icon={category?.name!} />
                            <span>{category?.name || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="py-3">
                          ${toNumber(product.price).toFixed(2)}
                        </td>
                        <td className="py-3 text-right">
                          <span className="font-medium text-rose-500">
                            {product.stockQuantity}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="py-6 text-center text-muted-foreground">
              {t('dashboard.cards.lowStockItems.emptyMessage')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
