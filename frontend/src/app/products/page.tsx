"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/products/product-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { productService } from "@/services/product";
import type { Product } from "@/types/product";

export default function ProductsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts({
        status: "published", // 只顯示已上架的商品
      });
      setProducts(response.data);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "載入失敗",
        description: error?.response?.data?.message || "無法載入商品列表",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">商品列表</h1>
      </div>

      {loading ? (
        <div className="text-center py-8">載入中...</div>
      ) : products.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          尚無商品資料
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onClick={() => router.push(`/products/${product._id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
