import { useState } from 'react';
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
  DialogTrigger,
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
import { Plus } from 'lucide-react';
import { IconPicker } from '@/components/icon-picker';
import { useTranslation } from 'react-i18next';

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

export type CategoryFormValues = z.infer<typeof formSchema>;

type AddCategoryFormProps = {
  onSubmit: (data: CategoryFormValues) => Promise<void> | void;
};

export function AddCategoryForm({ onSubmit }: AddCategoryFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { t } = useTranslation();

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      icon: '',
    },
  });

  const handleSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);

    try {
      await onSubmit(data);
      setIsDialogOpen(false);
      form.reset();
    } catch (error) {
      console.error('Failed to add category', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> {t('categories.actions.add')}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('categories.form.title')}</DialogTitle>
          <DialogDescription>{t('categories.form.subtitle')}</DialogDescription>
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
                  <FormLabel>{t('categories.form.labels.name')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t('categories.form.placeholders.name')}
                      {...field}
                    />
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
                  <FormLabel>
                    {t('categories.form.labels.description')}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t(
                        'categories.form.placeholders.description'
                      )}
                      rows={3}
                      {...field}
                    />
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
                  <FormLabel>{t('categories.form.labels.icon')}</FormLabel>
                  <FormControl>
                    <IconPicker
                      placeholder={t('categories.form.placeholders.icon')}
                      value={field.value}
                      onSelect={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? t('categories.form.actions.loadings.save')
                  : t('categories.form.actions.save')}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
