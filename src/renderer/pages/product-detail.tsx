import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Pencil,
  Trash,
  Calendar,
  Tag,
  DollarSign,
  Package,
  Plus,
  Minus,
  User,
  Mail,
  Phone,
  FileText,
} from 'lucide-react';
import { useProducts } from '@/context/product-context';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const stockFormSchema = z.object({
  quantity: z.preprocess(
    (val) => parseInt(val as string, 10),
    z.number()
      .min(-999999, { message: 'Quantity too low' })
      .max(999999, { message: 'Quantity too high' })
  ),
  note: z.string().min(1, { message: 'Note is required' }).max(500),
  customerName: z.string().optional(),
  customerEmail: z.string().email({ message: 'Invalid email address' }).optional(),
  customerPhone: z.string().optional(),
  orderReference: z.string().optional(),
  shippingAddress: z.string().optional(),
});

type StockFormValues = z.infer<typeof stockFormSchema>;

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { products, categories, deleteProduct, updateStock } = useProducts();
  const navigate = useNavigate();

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStockDialogOpen, setIsStockDialogOpen] = useState(false);
  const [stockAction, setStockAction] = useState<'add' | 'remove'>('add');

  const product = products.find(p => p.id === id);
  const category = categories.find(c => product && c.id === product.categoryId);

  const stockForm = useForm<StockFormValues>({
    resolver: zodResolver(stockFormSchema),
    defaultValues: {
      quantity: 1,
      note: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      orderReference: '',
      shippingAddress: '',
    },
  });

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] space-y-4">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Button onClick={() => navigate('/products')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Button>
      </div>
    );
  }

  const handleDelete = async () => {
    try {
      deleteProduct(product.id);
      toast.success('Product deleted successfully');
      navigate('/products');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete product');
    }
  };

  const handleStockSubmit = async (data: StockFormValues) => {
    try {
      const quantity = stockAction === 'add' ? data.quantity : -data.quantity;

      if (stockAction === 'remove' && Math.abs(quantity) > product.stockQuantity) {
        toast.error('Cannot remove more items than available in stock');
        return;
      }

      let note = data.note;

      // Add customer details to note if available (for sales)
      if (stockAction === 'remove' && data.customerName) {
        note = `Sale - ${data.customerName}\n` +
          `Order Ref: ${data.orderReference || 'N/A'}\n` +
          `Contact: ${data.customerEmail || 'N/A'} / ${data.customerPhone || 'N/A'}\n` +
          `Shipping: ${data.shippingAddress || 'N/A'}\n\n` +
          `Note: ${data.note}`;
      }

      updateStock(product.id, {
        quantity,
        note,
      });

      toast.success(`Stock ${stockAction === 'add' ? 'added' : 'removed'} successfully`);
      setIsStockDialogOpen(false);
      stockForm.reset();
    } catch (error) {
      console.error(error);
      toast.error('Failed to update stock');
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      console.error(error);
      return 'Invalid date';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/products')}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{product.name}</h2>
            <div className="flex items-center mt-1">
              <div
                className="w-2 h-2 mr-2 rounded-full"
                style={{ backgroundColor: category?.color || 'gray' }}
              />
              <span className="text-muted-foreground">
                {category?.name || 'Uncategorized'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Dialog open={isStockDialogOpen} onOpenChange={setIsStockDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="text-emerald-600"
                onClick={() => {
                  setStockAction('add');
                  stockForm.reset();
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Stock
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>
                  {stockAction === 'add' ? 'Add Stock' : 'Sell Product'}
                </DialogTitle>
                <DialogDescription>
                  {stockAction === 'add'
                    ? 'Add new items to the product inventory'
                    : 'Record a sale and update inventory'}
                </DialogDescription>
              </DialogHeader>

              <Form {...stockForm}>
                <form onSubmit={stockForm.handleSubmit(handleStockSubmit)} className="space-y-4">
                  <FormField
                    control={stockForm.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          {stockAction === 'remove' &&
                            `Available stock: ${product.stockQuantity}`
                          }
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {stockAction === 'remove' && (
                    <>
                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={stockForm.control}
                          name="customerName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Customer Name</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <User className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input className="pl-8" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={stockForm.control}
                          name="orderReference"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Order Reference</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <FileText className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input className="pl-8" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <FormField
                          control={stockForm.control}
                          name="customerEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Customer Email</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input type="email" className="pl-8" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={stockForm.control}
                          name="customerPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Customer Phone</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                  <Input className="pl-8" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={stockForm.control}
                        name="shippingAddress"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Shipping Address</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter shipping address..."
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  <FormField
                    control={stockForm.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {stockAction === 'add' ? 'Note' : 'Additional Notes'}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder={
                              stockAction === 'add'
                                ? "Enter reason for stock addition..."
                                : "Enter any additional notes about the sale..."
                            }
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="submit">
                      {stockAction === 'add' ? 'Add Stock' : 'Complete Sale'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>

          <Dialog open={isStockDialogOpen} onOpenChange={setIsStockDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="text-rose-600"
                onClick={() => {
                  setStockAction('remove');
                  stockForm.reset();
                }}
              >
                <Minus className="w-4 h-4 mr-2" />
                Sell Product
              </Button>
            </DialogTrigger>
          </Dialog>

          <Button
            variant="outline"
            onClick={() => navigate(`/products/${product.id}/edit`)}
          >
            <Pencil className="w-4 h-4 mr-2" />
            Edit Product
          </Button>

          <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the product
                  "{product.name}" from the database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Product Image */}
        <Card className="md:col-span-1">
          <CardContent className="p-0">
            <div className="relative overflow-hidden rounded-t-lg aspect-square">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="p-6">
              <h3 className="mb-2 font-semibold">Product Details</h3>
              <div className="space-y-4">
                <div className="flex items-center text-sm">
                  <DollarSign className="w-4 h-4 mr-2 text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground">Price</span>
                    <p className="font-medium">${product.price.toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex items-center text-sm">
                  <Package className="w-4 h-4 mr-2 text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground">Stock Quantity</span>
                    <p className={`font-medium ${product.stockQuantity < 5
                      ? 'text-rose-500'
                      : product.stockQuantity < 10
                        ? 'text-amber-500'
                        : ''
                      }`}>
                      {product.stockQuantity} units
                    </p>
                  </div>
                </div>

                <div className="flex items-center text-sm">
                  <Tag className="w-4 h-4 mr-2 text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground">Category</span>
                    <p className="font-medium">{category?.name || 'Uncategorized'}</p>
                  </div>
                </div>

                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground">Added on</span>
                    <p className="font-medium">{formatDate(product.createdAt)}</p>
                  </div>
                </div>

                <div className="flex items-center text-sm">
                  <Calendar className="w-4 h-4 mr-2 text-muted-foreground" />
                  <div>
                    <span className="text-muted-foreground">Last updated</span>
                    <p className="font-medium">{formatDate(product.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Product Information */}
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-xl font-semibold">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              <Separator />

              <div>
                <h3 className="mb-4 text-xl font-semibold">Inventory Summary</h3>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Current Stock</p>
                        <p className="text-2xl font-bold">{product.stockQuantity}</p>
                      </div>
                      <Package className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Total Value</p>
                        <p className="text-2xl font-bold">
                          ${(product.price * product.stockQuantity).toFixed(2)}
                        </p>
                      </div>
                      <DollarSign className="w-8 h-8 text-muted-foreground/30" />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-4 text-xl font-semibold">Product ID</h3>
                <p className="font-mono text-sm text-muted-foreground">{product.id}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}