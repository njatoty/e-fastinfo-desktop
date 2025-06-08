'use client';

import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useState } from 'react';

interface ImageUploadProps {
  value?: string;
  onChange: (value: string) => void;
  label?: string;
  description?: string;
}

export const ImageUpload = ({
  value,
  onChange,
  label = 'Image',
  description,
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(value || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Use file.path in Electron, fallback to Object URL in browser
      const filePath = (file as any).path || '';
      const previewPath = URL.createObjectURL(file);
      onChange(filePath);
      setPreview(previewPath);
    }
  };

  return (
    <FormItem>
      {label && <FormLabel>{label}</FormLabel>}
      <FormControl>
        <>
          <Input type="file" accept="image/*" onChange={handleFileChange} />
          {preview && (
            <img
              src={preview}
              alt="Uploaded preview"
              className="mt-2 object-cover w-auto aspect-video rounded border"
            />
          )}
        </>
      </FormControl>
      {description && <FormDescription>{description}</FormDescription>}
      <FormMessage />
    </FormItem>
  );
};
