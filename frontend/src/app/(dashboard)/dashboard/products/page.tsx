"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductCard } from "@/components/products/product-card";
import { Button } from "@/components/ui/button";
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
import { Plus } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

export default function ProductsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { user } = useAuthStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<string>("all");

  useEffect(() => {
    loadProducts();
  }, [status]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getMyListings({
        status: status === "all" ? undefined : status,
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

  if (user?.role !== "seller") {
    return (
      <div className="text-center py-8 text-muted-foreground">
        只有賣家可以訪問此頁面
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">商品管理</h1>
        <Button onClick={() => router.push("/dashboard/products/new")}>
          <Plus className="mr-2 h-4 w-4" /> 新增商品
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="選擇狀態" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="draft">草稿</SelectItem>
              <SelectItem value="published">上架中</SelectItem>
              <SelectItem value="reserved">已預約</SelectItem>
              <SelectItem value="sold">已售出</SelectItem>
            </SelectContent>
          </Select>
        </div>
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
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
