import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { Skeleton } from '@/components/ui/skeleton'; // adjust path to your project
import { useDebounce } from '@/hooks/use-debounce';
import { StarFilledIcon } from '@radix-ui/react-icons';
import { cn } from '@/lib/utils';

const GOOGLE_API_KEY = 'AIzaSyCCQSbCee3fhdM4fxI5q6tjOaEn4jCMZ8I';
const CX = '17a18b45094da4f02';

interface ImageSearchProps {
  query: string;
  onSelect?: (url: string) => void;
  count?: number;
}

interface GoogleImageItem {
  link: string;
}

interface GoogleImageSearchResponse {
  items?: GoogleImageItem[];
}

const ImageSearch: React.FC<ImageSearchProps> = ({
  query,
  count = 6,
  onSelect,
}) => {
  const debouncedQuery = useDebounce(query, 1000);

  const [selectedImages, setSelectedImages] = useState<string>();
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchImages = async () => {
      if (!debouncedQuery) return;
      try {
        setLoading(true);
        setError('');
        setImages([]);
        const response = await axios.get<GoogleImageSearchResponse>(
          'https://www.googleapis.com/customsearch/v1',
          {
            params: {
              key: GOOGLE_API_KEY,
              cx: CX,
              q: `${debouncedQuery} product -site:facebook.com -site:instagram.com -site:fbsbx.com`,
              searchType: 'image',
              num: count,
            },
          }
        );

        const imageResults =
          response.data.items?.map((item) => item.link) || [];
        setImages(imageResults);
      } catch (err: any) {
        console.error('Error fetching images:', err);
        setError(
          'Failed to load images. Please try again. ' +
            err.response?.data.error.message || ''
        );
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, [debouncedQuery, count]);

  const handleSelectImage = useCallback(
    (image: string) => {
      setSelectedImages(image);
      onSelect?.(image);
    },
    [setSelectedImages]
  );

  if (debouncedQuery.trim().length === 0) return null;

  return (
    <div className="p-4 space-y-4">
      <h2 className="font-semibold text-sm">Image results for: "{query}"</h2>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: count }).map((_, index) => (
            <Skeleton
              key={index}
              className="aspect-square w-full h-48 rounded-lg"
            />
          ))}
        </div>
      )}

      {error && (
        <div className="text-xs text-destructive border border-destructive/30 bg-destructive/10 p-2 rounded-lg">
          {error}
        </div>
      )}

      {!loading && !error && images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {images.map((url, index) => {
            const isSelected = selectedImages === url;
            return (
              <div
                className={cn(
                  'relative rounded-lg bg-background border',
                  isSelected
                    ? 'ring ring-accent/80'
                    : 'hover:ring hover:ring-muted'
                )}
                key={index}
              >
                <img
                  draggable={false}
                  src={url}
                  alt={`Result ${index + 1}`}
                  className="object-cover w-full h-48 shadow rounded-lg select-none"
                  onClick={() => handleSelectImage(url)}
                />
                {isSelected && (
                  <div
                    className="absolute inset-0 flex items-center justify-center bg-white/30"
                    onClick={() => handleSelectImage('')}
                  >
                    <StarFilledIcon className="w-10 h-10 rounded-full p-1 ring-2 ring-background/20 text-accent-foreground bg-accent" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {!loading && !error && images.length === 0 && (
        <div className="text-muted-foreground text-xs">No images found.</div>
      )}
    </div>
  );
};

export default ImageSearch;
