import { useState } from 'react';
import { Plus, Pencil, Trash, Tag } from 'lucide-react';
import { useProducts } from '@/context/product-context';

import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';
import {
  AddCategoryForm,
  type CategoryFormValues,
} from '@/components/forms/add-category-form';
import {
  EditCategoryForm,
  EditCategoryFormValues,
} from '@/components/forms/edit-category-form';
import { IconValue } from '@/components/icon-picker';
import { useTranslation } from 'react-i18next';

export function CategoriesPage() {
  const { categories, products, addCategory, updateCategory, deleteCategory } =
    useProducts();
  const { t } = useTranslation();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSubmit = async (data: CategoryFormValues) => {
    setIsSubmitting(true);

    try {
      addCategory(data);
      toast.success('Category added successfully');
    } catch (error) {
      toast.error('Failed to add category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (data: CategoryFormValues) => {
    if (!selectedCategory) return;

    setIsSubmitting(true);

    try {
      updateCategory(selectedCategory, data);
      toast.success('Category updated successfully');
      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error('Failed to update category');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    try {
      deleteCategory(selectedCategory);
      toast.success('Category deleted successfully');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to delete category');
      }
    }
  };

  const openEditDialog = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      setSelectedCategory(categoryId);

      setIsEditDialogOpen(true);
    }
  };

  const openDeleteDialog = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setIsDeleteDialogOpen(true);
  };

  const countProductsInCategory = (categoryId: string) => {
    return products.filter((product) => product.categoryId === categoryId)
      .length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {t('categories.title')}
          </h2>
          <p className="text-muted-foreground">{t('categories.subtitle')}</p>
        </div>

        <AddCategoryForm onSubmit={handleAddSubmit} />
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="py-3 px-4 text-left font-medium">
                  {t('categories.table.headers.name')}
                </th>
                <th className="py-3 px-4 text-left font-medium">
                  {t('categories.table.headers.description')}
                </th>
                <th className="py-3 px-4 text-left font-medium">
                  {t('categories.table.headers.products')}
                </th>
                <th className="py-3 px-4 text-left font-medium">
                  {t('categories.table.headers.actions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id} className="border-b last:border-b-0">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <IconValue icon={category.icon!} />
                        <span className="font-medium">{category.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground">
                      {category.description}
                    </td>
                    <td className="py-3 px-4">
                      {countProductsInCategory(category.id)}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEditDialog(category.id)}
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">
                            {t('categories.action.edit')}
                          </span>
                        </Button>

                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive"
                          onClick={() => openDeleteDialog(category.id)}
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">
                            {t('categories.action.delete')}
                          </span>
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className="py-6 text-center text-muted-foreground"
                  >
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Edit Category Dialog */}
      <EditCategoryForm
        open={isEditDialogOpen}
        initialValues={
          categories.find(
            (c) => c.id === selectedCategory
          ) as EditCategoryFormValues
        }
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleEditSubmit}
      />

      {/* Delete Category Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedCategory &&
              countProductsInCategory(selectedCategory) > 0 ? (
                <div className="text-destructive">
                  This category cannot be deleted because it has products
                  associated with it. Please move or delete the products in this
                  category first.
                </div>
              ) : (
                'This action cannot be undone. This will permanently delete the category.'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={
                selectedCategory
                  ? countProductsInCategory(selectedCategory) > 0
                  : false
              }
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Empty State */}
      {categories.length === 0 && (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <Tag className="mx-auto h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No categories</h3>
          <p className="my-2 text-sm text-muted-foreground">
            You haven't created any categories yet. Categories help you organize
            your products.
          </p>

          <AddCategoryForm onSubmit={handleAddSubmit} />
        </div>
      )}
    </div>
  );
}
