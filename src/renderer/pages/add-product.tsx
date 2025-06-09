import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { useProducts } from '@/context/product-context';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import { AddProductForm } from '@/components/forms/add-product-form';

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

export type AddCategoryFormValues = z.infer<typeof formSchema>;

export function AddProductPage() {
  const { categories, addProduct } = useProducts();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: AddCategoryFormValues) => {
    setIsSubmitting(true);

    try {
      // Upload the selected image to destination folders and get its url path
      const productImageUrl = await window.electron.ipcRenderer.downloadImage(
        data.imageUrl
      );

      addProduct({
        price: data.price as number,
        stockQuantity: data.stockQuantity as number,
        category: {
          connect: { id: data.categoryId },
        },
        name: data.name,
        description: data.description,
        imageUrl: productImageUrl || data.imageUrl,
      });

      toast.success('Product added successfully');
      navigate('/products');
    } catch (error) {
      toast.error('Failed to add product');
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
          onClick={() => navigate('/products')}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Add New Product</h2>
          <p className="text-muted-foreground">
            Create a new product in your inventory
          </p>
        </div>
      </div>

      <Card className="mx-auto max-w-2xl space-y-8">
        <div className="rounded-lg border p-6">
          <AddProductForm
            categories={categories}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit}
          />
        </div>
      </Card>
    </div>
  );
}
