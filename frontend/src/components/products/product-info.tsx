"use client";

import { formatPrice } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { Product } from "@/types/product";
import { Info } from "lucide-react";

interface ProductInfoProps {
  product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const { basicInfo } = product;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-2xl">{basicInfo.title}</CardTitle>
            <CardDescription>
              編號：{product.legalInfo.registrationNumber}
            </CardDescription>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {formatPrice(basicInfo.price)}
            </div>
            {basicInfo.negotiable && (
              <div className="text-sm text-muted-foreground">價格可議</div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <span>商品狀態</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>商品目前的銷售狀態</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className="font-medium">
            {product.status === "draft" && "草稿"}
            {product.status === "published" && "銷售中"}
            {product.status === "reserved" && "已預約"}
            {product.status === "sold" && "已售出"}
            {product.status === "deleted" && "已下架"}
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">商品描述</div>
          <div className="text-sm text-muted-foreground whitespace-pre-wrap">
            {basicInfo.description}
          </div>
        </div>

        {basicInfo.video && (
          <div className="space-y-2">
            <div className="text-sm font-medium">環景影片</div>
            <div className="aspect-video">
              <iframe
                src={basicInfo.video}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {basicInfo.virtualTour && (
          <div className="space-y-2">
            <div className="text-sm font-medium">虛擬導覽</div>
            <div className="aspect-video">
              <iframe
                src={basicInfo.virtualTour}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
