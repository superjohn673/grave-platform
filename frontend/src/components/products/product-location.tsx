"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Product } from "@/types/product";
import { Car, Temple, Store } from "lucide-react";

interface ProductLocationProps {
  product: Product;
}

export function ProductLocation({ product }: ProductLocationProps) {
  const { location } = product;

  return (
    <Card>
      <CardHeader>
        <CardTitle>位置資訊</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-1">
          <div className="text-sm text-muted-foreground">墓園名稱</div>
          <div className="font-medium">{location.cemetery}</div>
        </div>

        <div>
          <div className="text-sm text-muted-foreground mb-2">位置</div>
          <div className="space-y-1">
            <div className="font-medium">
              {location.city}
              {location.district}
            </div>
            <div className="text-sm text-muted-foreground">
              {location.address}
            </div>
          </div>
        </div>

        <div>
          <div className="text-sm text-muted-foreground mb-2">周邊設施</div>
          <div className="flex flex-wrap gap-2">
            {location.surroundings.parking && (
              <Badge variant="secondary">
                <Car className="mr-1 h-3 w-3" />
                停車場
              </Badge>
            )}
            {location.surroundings.temple && (
              <Badge variant="secondary">
                <Temple className="mr-1 h-3 w-3" />
                廟宇
              </Badge>
            )}
            {location.surroundings.restaurant && (
              <Badge variant="secondary">
                <Store className="mr-1 h-3 w-3" />
                餐廳
              </Badge>
            )}
            {location.surroundings.transportation.map((transport) => (
              <Badge key={transport} variant="secondary">
                {transport}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
