import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Pencil, Trash, Package } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from './ui/card';
import { Button } from './ui/button';
import { IconValue } from './icon-picker';
import { ProductWithIncludes } from './services/product.service';
import { toNumber } from '@/lib/utils';

interface ProductCardProps {
  product: ProductWithIncludes;
  onView: (id: string, e: React.MouseEvent) => void;
  onEdit: (id: string, e: React.MouseEvent) => void;
  onDelete: (id: string, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onView,
  onEdit,
  onDelete,
}) => {
  const navigate = useNavigate();

  return (
    <Card
      key={product.id}
      className="overflow-hidden transition-shadow cursor-pointer hover:shadow-lg"
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <div className="relative aspect-video">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-auto max-h-[300px] object-contain"
        />
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="secondary" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={(e) => onView(product.id, e)}>
                <Eye className="w-4 h-4 mr-2" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => onEdit(product.id, e)}>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={(e) => onDelete(product.id, e)}
              >
                <Trash className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardHeader className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <IconValue icon={product.category.icon!} />
          <span className="text-sm text-muted-foreground">
            {product.category.name || 'Unknown'}
          </span>
        </div>
        <h3 className="font-semibold truncate">{product.name}</h3>
      </CardHeader>

      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {product.description}
        </p>
      </CardContent>

      <CardFooter className="flex items-center justify-between p-4 border-t">
        <div className="flex items-center gap-2">
          <Package className="w-4 h-4 text-muted-foreground" />
          <span
            className={`text-sm font-medium ${
              product.stockQuantity < 5
                ? 'text-rose-500'
                : product.stockQuantity < 10
                ? 'text-amber-500'
                : ''
            }`}
          >
            {product.stockQuantity}
          </span>
        </div>
        <span className="font-semibold">
          ${toNumber(product.price).toFixed(2)}
        </span>
      </CardFooter>
    </Card>
  );
};
