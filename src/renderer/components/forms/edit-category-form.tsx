import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useEffect, useState } from 'react';
import { IconPicker } from '@/components/icon-picker';

const formSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Category name must be at least 2 characters.',
    })
    .max(50, {
      message: 'Category name must not exceed 50 characters.',
    }),
  description: z.string().max(200, {
    message: 'Description must not exceed 200 characters.',
  }),
  icon: z.string().min(1, {
    message: 'Please select an icon.',
  }),
});

export type EditCategoryFormValues = z.infer<typeof formSchema>;

type EditCategoryFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: EditCategoryFormValues;
  onSubmit: (data: EditCategoryFormValues) => Promise<void> | void;
};

export function EditCategoryForm({
  open,
  onOpenChange,
  initialValues,
  onSubmit,
}: EditCategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<EditCategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialValues,
  });

  // Sync form when initialValues change (when editing a different category)
  useEffect(() => {
    form.reset(initialValues);
  }, [initialValues, form]);

  const handleSubmit = async (data: EditCategoryFormValues) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onOpenChange(false); // close dialog after success
    } catch (error) {
      console.error('Failed to update category', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>Update category information.</DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
                    <Textarea rows={3} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <FormControl>
                    <IconPicker value={field.value} onSelect={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
