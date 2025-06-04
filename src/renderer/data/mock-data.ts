import { Product, Category } from '@/types';

export const mockCategories: Category[] = [
  {
    id: 'cat-1',
    name: 'Keyboards',
    description: 'Computer and laptop keyboards',
    color: '#3B82F6' // blue
  },
  {
    id: 'cat-2',
    name: 'Mice',
    description: 'Computer mice and pointing devices',
    color: '#10B981' // emerald
  },
  {
    id: 'cat-3',
    name: 'Monitors',
    description: 'Computer monitors and displays',
    color: '#8B5CF6' // violet
  },
  {
    id: 'cat-4',
    name: 'Headphones',
    description: 'Audio headphones and earphones',
    color: '#EC4899' // pink
  },
  {
    id: 'cat-5',
    name: 'Mobile Phones',
    description: 'Smartphones and mobile devices',
    color: '#F59E0B' // amber
  }
];

export const mockProducts: Product[] = [
  {
    id: 'prod-1',
    name: 'Mechanical Gaming Keyboard RGB',
    categoryId: 'cat-1',
    description: 'High-performance mechanical gaming keyboard with RGB backlighting and programmable keys.',
    imageUrl: 'https://images.pexels.com/photos/2115257/pexels-photo-2115257.jpeg',
    price: 129.99,
    stockQuantity: 42,
    createdAt: '2023-03-15T10:30:00Z',
    updatedAt: '2023-03-15T10:30:00Z'
  },
  {
    id: 'prod-2',
    name: 'Wireless Ergonomic Mouse',
    categoryId: 'cat-2',
    description: 'Comfortable ergonomic wireless mouse with precision tracking and long battery life.',
    imageUrl: 'https://images.pexels.com/photos/3944104/pexels-photo-3944104.jpeg',
    price: 59.99,
    stockQuantity: 78,
    createdAt: '2023-03-10T14:15:00Z',
    updatedAt: '2023-03-10T14:15:00Z'
  },
  {
    id: 'prod-3',
    name: '27" 4K Ultra HD Monitor',
    categoryId: 'cat-3',
    description: '27-inch 4K Ultra HD monitor with HDR support, wide color gamut, and adjustable stand.',
    imageUrl: 'https://images.pexels.com/photos/1029757/pexels-photo-1029757.jpeg',
    price: 349.99,
    stockQuantity: 15,
    createdAt: '2023-02-28T09:45:00Z',
    updatedAt: '2023-02-28T09:45:00Z'
  },
  {
    id: 'prod-4',
    name: 'Noise-Cancelling Bluetooth Headphones',
    categoryId: 'cat-4',
    description: 'Premium noise-cancelling Bluetooth headphones with 30-hour battery life and comfort fit.',
    imageUrl: 'https://images.pexels.com/photos/3394666/pexels-photo-3394666.jpeg',
    price: 249.99,
    stockQuantity: 23,
    createdAt: '2023-02-20T16:30:00Z',
    updatedAt: '2023-02-20T16:30:00Z'
  },
  {
    id: 'prod-5',
    name: 'Flagship Smartphone X Pro',
    categoryId: 'cat-5',
    description: 'Latest flagship smartphone with 6.7" OLED display, 5G connectivity, and 108MP camera.',
    imageUrl: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg',
    price: 999.99,
    stockQuantity: 8,
    createdAt: '2023-03-01T11:20:00Z',
    updatedAt: '2023-03-01T11:20:00Z'
  },
  {
    id: 'prod-6',
    name: 'Compact Wireless Keyboard',
    categoryId: 'cat-1',
    description: 'Slim, compact wireless keyboard perfect for office or home use with multi-device connectivity.',
    imageUrl: 'https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg',
    price: 79.99,
    stockQuantity: 54,
    createdAt: '2023-03-12T13:40:00Z',
    updatedAt: '2023-03-12T13:40:00Z'
  },
  {
    id: 'prod-7',
    name: 'Gaming Mouse with 16K DPI',
    categoryId: 'cat-2',
    description: 'High-precision gaming mouse with 16,000 DPI sensor, programmable buttons, and RGB lighting.',
    imageUrl: 'https://images.pexels.com/photos/2115256/pexels-photo-2115256.jpeg',
    price: 89.99,
    stockQuantity: 32,
    createdAt: '2023-03-05T15:50:00Z',
    updatedAt: '2023-03-05T15:50:00Z'
  },
  {
    id: 'prod-8',
    name: '32" Curved Gaming Monitor',
    categoryId: 'cat-3',
    description: '32-inch curved gaming monitor with 165Hz refresh rate, 1ms response time, and adaptive sync.',
    imageUrl: 'https://images.pexels.com/photos/1714208/pexels-photo-1714208.jpeg',
    price: 429.99,
    stockQuantity: 3,
    createdAt: '2023-02-25T10:10:00Z',
    updatedAt: '2023-02-25T10:10:00Z'
  },
  {
    id: 'prod-9',
    name: 'True Wireless Earbuds',
    categoryId: 'cat-4',
    description: 'True wireless earbuds with active noise cancellation, water resistance, and wireless charging case.',
    imageUrl: 'https://images.pexels.com/photos/3780681/pexels-photo-3780681.jpeg',
    price: 149.99,
    stockQuantity: 65,
    createdAt: '2023-03-18T09:20:00Z',
    updatedAt: '2023-03-18T09:20:00Z'
  },
  {
    id: 'prod-10',
    name: 'Mid-range Android Phone',
    categoryId: 'cat-5',
    description: 'Feature-packed mid-range Android phone with 6.5" display, quad camera, and fast charging.',
    imageUrl: 'https://images.pexels.com/photos/47261/pexels-photo-47261.jpeg',
    price: 349.99,
    stockQuantity: 12,
    createdAt: '2023-03-08T14:30:00Z',
    updatedAt: '2023-03-08T14:30:00Z'
  }
];