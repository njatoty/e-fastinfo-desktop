import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

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
import { ProductWithIncludes } from '../services/product.service';
import { CategoryWithIncludes } from '../services/category.service';
import { toNumber } from '@/lib/utils';
import ImageSearch from '../ImageSearch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ImageUpload } from '../ImageUpload';
import { EditIcon } from 'lucide-react';

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Product name must be at least 2 characters.',
    })
    .max(100, {
      message: 'Product name must not exceed 100 characters.',
    }),
  categoryId: z.string({
    required_error: 'Please select a category.',
  }),
  description: z
    .string()
    .min(10, {
      message: 'Description must be at least 10 characters.',
    })
    .max(500, {
      message: 'Description must not exceed 500 characters.',
    }),
  imageUrl: z.string().url({
    message: 'Please enter a valid URL for the product image.',
  }),
  price: z.preprocess(
    (val) => parseFloat(val as string),
    z
      .number()
      .positive({
        message: 'Price must be a positive number.',
      })
      .min(0.01, {
        message: 'Price must be at least 0.01.',
      })
  ),
  originalPrice: z.preprocess(
    (val) => {
      if (val === '' || val === null || val === undefined) return undefined;
      return parseFloat(val as string);
    },
    z
      .number()
      .positive({
        message: 'Original price must be a positive number.',
      })
      .min(0.01, {
        message: 'Original price must be at least 0.01.',
      })
      .optional() // this makes it optional
  ),
  stockQuantity: z.preprocess(
    (val) => parseInt(val as string, 10),
    z
      .number()
      .int({
        message: 'Stock quantity must be a whole number.',
      })
      .nonnegative({
        message: 'Stock quantity cannot be negative.',
      })
  ),
});

type EditProductFormValues = z.infer<typeof formSchema>;

interface EditProductFormProps {
  categories: CategoryWithIncludes[];
  product: ProductWithIncludes;
  onSubmit: (data: EditProductFormValues) => void;
  isSubmitting?: boolean;
}

export function EditProductForm({
  categories,
  product,
  isSubmitting = false,
  onSubmit,
}: EditProductFormProps) {
  const navigate = useNavigate();
  const [queryImage, setQueryImage] = useState('');
  const [editImage, setEditImage] = useState(false);
  const form = useForm<EditProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      categoryId: '',
      description: '',
      imageUrl: '',
      price: undefined,
      originalPrice: undefined,
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
        price: toNumber(product.price),
        originalPrice: toNumber(product.originalPrice) || undefined,
        stockQuantity: product.stockQuantity,
      });
    }
  }, [product, form]);

  return (
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
                <Textarea rows={4} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {editImage ? (
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex justify-between items-end">
                  <span>Product Image</span>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setEditImage(false);
                      // reset product imageurl
                      if (product.imageUrl !== field.value) {
                        field.onChange(product.imageUrl);
                      }
                    }}
                  >
                    <EditIcon className="w-4 h-4 mr-2" />
                    Cancel Edit
                  </Button>
                </FormLabel>
                <FormControl>
                  <>
                    <Tabs defaultValue="upload" className="w-full">
                      <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="upload">Upload Image</TabsTrigger>
                        <TabsTrigger value="search">Search Online</TabsTrigger>
                      </TabsList>

                      <TabsContent value="upload" className="space-y-2">
                        <ImageUpload
                          // value={field.value}
                          onChange={async (url: string) => {
                            field.onChange(url);
                          }}
                          label="Product Image"
                          description="Upload an image of the product"
                        />
                      </TabsContent>

                      <TabsContent value="search" className="space-y-2">
                        <Input
                          type="text"
                          placeholder="Search images"
                          value={queryImage}
                          onChange={(e) => setQueryImage(e.target.value)}
                        />

                        <ImageSearch
                          query={queryImage}
                          onSelect={async (url) => {
                            field.onChange(url);
                          }}
                        />
                      </TabsContent>
                    </Tabs>
                  </>
                </FormControl>
                <FormDescription>
                  You can upload an image or search online and select one.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        ) : (
          <div className="flex gap-2 items-start">
            <img
              src={product.imageUrl}
              alt="product image border rounded-lg"
              className="aspect-video h-28 object-contain"
            />
            <Button variant="ghost" onClick={() => setEditImage(true)}>
              <EditIcon className="w-4 h-4 mr-2" />
              Edit Image
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
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
            name="originalPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Original Price ($)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
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
  );
}
