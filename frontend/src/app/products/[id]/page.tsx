"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductInfo } from "@/components/products/product-info";
import { ProductLocation } from "@/components/products/product-location";
import { ProductFeatures } from "@/components/products/product-features";
import { useToast } from "@/components/ui/use-toast";
import { productService } from "@/services/product";
import type { Product } from "@/types/product";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const data = await productService.getProduct(params.id);
        setProduct(data);
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "載入失敗",
          description: error?.response?.data?.message || "無法載入商品資訊",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [params.id, toast]);

  if (loading) {
    return <div className="text-center py-8">載入中...</div>;
  }

  if (!product) {
    return <div className="text-center py-8">商品不存在</div>;
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="p-0 h-auto"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">商品詳情</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ProductGallery images={product.basicInfo.images} />
        <div className="space-y-8">
          <ProductInfo product={product} />
          <ProductFeatures product={product} />
          <ProductLocation product={product} />
        </div>
      </div>
    </div>
  );
}
