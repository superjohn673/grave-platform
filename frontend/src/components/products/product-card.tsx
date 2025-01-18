import { formatPrice } from "@/lib/utils";
import { Product } from "@/types/product";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface ProductCardProps {
  product: Product;
}

const STATUS_MAP = {
  draft: "草稿",
  published: "上架中",
  reserved: "已預約",
  sold: "已售出",
  deleted: "已刪除",
};

const STATUS_COLOR_MAP = {
  draft: "bg-gray-500",
  published: "bg-green-500",
  reserved: "bg-yellow-500",
  sold: "bg-blue-500",
  deleted: "bg-red-500",
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-video">
        <Image
          src={product.basicInfo.images[0] || "/placeholder.png"}
          alt={product.basicInfo.title}
          fill
          className="object-cover"
        />
        <Badge
          className={`absolute top-2 right-2 ${
            STATUS_COLOR_MAP[product.status]
          }`}
        >
          {STATUS_MAP[product.status]}
        </Badge>
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">
          <Link href={`/dashboard/products/${product._id}`}>
            {product.basicInfo.title}
          </Link>
        </CardTitle>
        <CardDescription className="flex justify-between items-center">
          <span>{product.location.cemetery}</span>
          <span className="text-lg font-semibold text-primary">
            {formatPrice(product.basicInfo.price)}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          <div className="flex justify-between mb-1">
            <span>格位類型</span>
            <span>{product.features.type}</span>
          </div>
          <div className="flex justify-between mb-1">
            <span>面向</span>
            <span>{product.features.facing}</span>
          </div>
          <div className="flex justify-between">
            <span>樓層</span>
            <span>{product.features.floor}樓</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">
        <div className="w-full flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span>瀏覽: {product.statistics.views}</span>
            <span>收藏: {product.statistics.favorites}</span>
          </div>
          <span>{new Date(product.createdAt).toLocaleDateString()}</span>
        </div>
      </CardFooter>
    </Card>
  );
}
