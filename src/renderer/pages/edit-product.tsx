import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { useProducts } from '@/context/product-context';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Product name must be at least 2 characters.',
  }).max(100, {
    message: 'Product name must not exceed 100 characters.',
  }),
  categoryId: z.string({
    required_error: 'Please select a category.',
  }),
  description: z.string().min(10, {
    message: 'Description must be at least 10 characters.',
  }).max(500, {
    message: 'Description must not exceed 500 characters.',
  }),
  imageUrl: z.string().url({
    message: 'Please enter a valid URL for the product image.',
  }),
  price: z.preprocess(
    (val) => parseFloat(val as string),
    z.number().positive({
      message: 'Price must be a positive number.',
    }).min(0.01, {
      message: 'Price must be at least 0.01.',
    })
  ),
  stockQuantity: z.preprocess(
    (val) => parseInt(val as string, 10),
    z.number().int({
      message: 'Stock quantity must be a whole number.',
    }).nonnegative({
      message: 'Stock quantity cannot be negative.',
    })
  ),
});

type FormValues = z.infer<typeof formSchema>;

export function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const { products, categories, updateProduct } = useProducts();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const product = products.find(p => p.id === id);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      categoryId: '',
      description: '',
      imageUrl: '',
      price: undefined,
      stockQuantity: undefined,
    },
  });
  
  // Set form values when product is loaded
  useEffect(() => {
    if (product) {
      form.reset({
        name: product.name,
        categoryId: product.categoryId,
        description: product.description,
        imageUrl: product.imageUrl,
        price: product.price,
        stockQuantity: product.stockQuantity,
      });
    }
  }, [product, form]);
  
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] space-y-4">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Button onClick={() => navigate('/products')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>
      </div>
    );
  }
  
  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      updateProduct(product.id, {
        ...data,
        updatedAt: new Date().toISOString(),
      });
      
      toast.success('Product updated successfully');
      navigate(`/products/${product.id}`);
    } catch (error) {
      toast.error('Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline"
          size="icon"
          onClick={() => navigate(`/products/${product.id}`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Product</h2>
          <p className="text-muted-foreground">
            Update product information
          </p>
        </div>
      </div>
      
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="rounded-lg border p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      This is the name that will be displayed to users.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Choose the category this product belongs to.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Provide a URL to an image of the product.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          {...field}
                          value={field.value === undefined ? '' : field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="stockQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Stock Quantity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min="0"
                          step="1"
                          {...field}
                          value={field.value === undefined ? '' : field.value}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/products/${product.id}`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}