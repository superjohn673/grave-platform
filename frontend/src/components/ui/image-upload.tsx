"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  onUpload: (files: File[]) => Promise<string[]>;
  maxFiles?: number;
  disabled?: boolean;
}

export function ImageUpload({
  value = [],
  onChange,
  onUpload,
  maxFiles = 10,
  disabled = false,
}: ImageUploadProps) {
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      try {
        setLoading(true);
        const urls = await onUpload(acceptedFiles);
        onChange([...value, ...urls]);
      } catch (error) {
        console.error("Upload error:", error);
      } finally {
        setLoading(false);
      }
    },
    [onChange, onUpload, value]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    },
    maxFiles: maxFiles - value.length,
    disabled: disabled || loading || value.length >= maxFiles,
  });

  const removeImage = (urlToRemove: string) => {
    onChange(value.filter((url) => url !== urlToRemove));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {value.map((url, index) => (
          <div key={url} className="group relative aspect-square">
            <Image
              src={url}
              alt={`Upload ${index + 1}`}
              className="rounded-lg object-cover"
              fill
            />
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute right-2 top-2 rounded-full bg-rose-500 p-1 text-white opacity-0 transition group-hover:opacity-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
        {value.length < maxFiles && (
          <div
            {...getRootProps()}
            className={cn(
              "flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed transition hover:border-gray-400",
              isDragActive && "border-gray-400",
              disabled && "cursor-not-allowed opacity-50"
            )}
          >
            <input {...getInputProps()} />
            <ImagePlus className="h-10 w-10 text-gray-400" />
            <p className="mt-2 text-sm text-gray-500">
              {loading ? "上傳中..." : "拖放或點擊上傳"}
            </p>
          </div>
        )}
      </div>
      {value.length >= maxFiles && (
        <p className="text-sm text-muted-foreground">
          已達到最大上傳數量 ({maxFiles} 張)
        </p>
      )}
    </div>
  );
}
