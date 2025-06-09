import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { ArrowLeft } from 'lucide-react';
import { useProducts } from '@/context/product-context';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { EditProductForm } from '@/components/forms/edit-product-form';
import {
  productService,
  type ProductWithIncludes,
} from '@/components/services/product.service';
import { Card } from '@/components/ui/card';

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

type FormValues = z.infer<typeof formSchema>;

export function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const { categories, updateProduct } = useProducts();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [product, setProduct] = useState<ProductWithIncludes>();

  // Set form values when product is loaded
  useEffect(() => {
    if (!id) return;

    async function fetchProductById(id: string) {
      const response = await productService.getById(id);
      if (response.data) {
        setProduct(response.data);
      }
    }
    fetchProductById(id);
  }, [id]);

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

  const handleSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      // Upload the selected image to destination folders and get its url path
      const productImageUrl = await window.electron.ipcRenderer.downloadImage(
        data.imageUrl
      );

      console.log(productImageUrl, data.imageUrl);

      updateProduct(product.id, {
        ...data,
        imageUrl: productImageUrl || product.imageUrl,
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
          <p className="text-muted-foreground">Update product information</p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl space-y-8">
        <Card className="rounded-lg p-6">
          <EditProductForm
            categories={categories}
            product={product}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </Card>
      </div>
    </div>
  );
}
