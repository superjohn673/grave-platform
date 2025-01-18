"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/types/product";

interface ProductFeaturesProps {
  product: Product;
}

const TYPE_MAP = {
  single: "單人塔位",
  double: "雙人塔位",
  family: "家族塔位",
};

const FACING_MAP = {
  south: "坐北朝南",
  north: "坐南朝北",
  west: "坐東朝西",
  east: "坐西朝東",
};

const RELIGION_MAP = {
  buddhism: "佛教",
  taoism: "道教",
  general: "一般",
};

export function ProductFeatures({ product }: ProductFeaturesProps) {
  const { features } = product;

  return (
    <Card>
      <CardHeader>
        <CardTitle>特徵資訊</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">塔位類型</div>
            <div className="font-medium">
              {TYPE_MAP[features.type as keyof typeof TYPE_MAP] ||
                features.type}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">尺寸</div>
            <div className="font-medium">{features.size}</div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">方位</div>
            <div className="font-medium">
              {FACING_MAP[features.facing as keyof typeof FACING_MAP] ||
                features.facing}
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">樓層</div>
            <div className="font-medium">{features.floor} 樓</div>
          </div>

          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">宗教屬性</div>
            <div className="font-medium">
              {RELIGION_MAP[features.religion as keyof typeof RELIGION_MAP] ||
                features.religion}
            </div>
          </div>

          {features.feng_shui.orientation && (
            <div className="space-y-1">
              <div className="text-sm text-muted-foreground">風水座向</div>
              <div className="font-medium">
                {features.feng_shui.orientation}
              </div>
            </div>
          )}

          {features.feng_shui.environment.length > 0 && (
            <div className="sm:col-span-2 space-y-1">
              <div className="text-sm text-muted-foreground">風水環境</div>
              <div className="font-medium">
                {features.feng_shui.environment.join("、")}
              </div>
            </div>
          )}

          {features.feng_shui.features.length > 0 && (
            <div className="sm:col-span-2 space-y-1">
              <div className="text-sm text-muted-foreground">風水特色</div>
              <div className="font-medium">
                {features.feng_shui.features.join("、")}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
