import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import ImageSearch from '@/components/ImageSearch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ImageUpload } from '@/components/ImageUpload';
import { CategoryWithIncludes } from '../services/category.service';
import { Button } from '../ui/button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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

export type AddProductFormValues = z.infer<typeof formSchema>;

interface AddProductProps {
  categories: CategoryWithIncludes[];
  onSubmit: (data: AddProductFormValues) => void;
  isSubmitting?: boolean;
}

export function AddProductForm({
  categories,
  onSubmit,
  isSubmitting = false,
}: AddProductProps) {
  const navigate = useNavigate();
  const [queryImage, setQueryImage] = useState('');
  const form = useForm<AddProductFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      categoryId: '',
      description: '',
      imageUrl: '',
      price: undefined,
      stockQuantity: undefined,
      originalPrice: undefined,
    },
  });

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
                <Input placeholder="Enter product name" {...field} />
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
                  placeholder="Enter product description"
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
              <FormLabel>Product Image</FormLabel>
              <FormControl>
                <>
                  <Tabs defaultValue="search" className="w-full">
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
                    placeholder="0.00"
                    {...field}
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
                    placeholder="0"
                    {...field}
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
            onClick={() => navigate('/products')}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Product'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
