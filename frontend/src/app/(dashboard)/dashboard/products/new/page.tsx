"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ImageUpload } from "@/components/ui/image-upload";
import { productService } from "@/services/product";
import { ArrowLeft } from "lucide-react";

// 塔位類型選項
const TYPE_OPTIONS = [
  { label: "單人塔位", value: "single" },
  { label: "雙人塔位", value: "double" },
  { label: "家族塔位", value: "family" },
];

// 方位選項
const FACING_OPTIONS = [
  { label: "坐北朝南", value: "south" },
  { label: "坐南朝北", value: "north" },
  { label: "坐東朝西", value: "west" },
  { label: "坐西朝東", value: "east" },
];

// 宗教選項
const RELIGION_OPTIONS = [
  { label: "佛教", value: "buddhism" },
  { label: "道教", value: "taoism" },
  { label: "一般", value: "general" },
];

// 處理圖片上傳
async function handleUpload(files: File[]): Promise<string[]> {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  try {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_token="))
      ?.split("=")[1];

    const response = await fetch("/api/uploads/products", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return data.urls;
  } catch (error) {
    console.error("Upload error:", error);
    throw error;
  }
}

export default function NewProductPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      basicInfo: {
        title: "",
        description: "",
        price: "",
        negotiable: true,
        images: [],
      },
      location: {
        cemetery: "",
        address: "",
        city: "",
        district: "",
      },
      features: {
        type: "",
        size: "",
        facing: "",
        floor: "",
        religion: "",
      },
      legalInfo: {
        registrationNumber: "",
      },
    },
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formattedData = {
        basicInfo: {
          ...data.basicInfo,
          price: Number(data.basicInfo.price),
          negotiable: true,
        },
        location: {
          ...data.location,
          coordinates: { lat: 0, lng: 0 },
          surroundings: {
            parking: false,
            temple: false,
            restaurant: false,
            transportation: [],
          },
        },
        features: {
          ...data.features,
          floor: Number(data.features.floor),
          feng_shui: {
            orientation: "",
            environment: [],
            features: [],
          },
        },
        legalInfo: {
          ...data.legalInfo,
          ownershipCertificate: "",
          propertyRights: [],
          transferable: true,
          restrictions: [],
        },
        verification: {
          status: "pending",
          documents: [],
        },
        status: "draft",
      };

      await productService.create(formattedData);
      toast({
        title: "成功",
        description: "商品已成功創建",
      });
      router.push("/dashboard/products");
    } catch (error) {
      console.error("Error creating product:", error);
      toast({
        variant: "destructive",
        title: "錯誤",
        description: error?.response?.data?.message || "創建商品失敗",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="p-0 h-auto"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">新增商品</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* 基本資訊 */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">基本資訊</h2>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="basicInfo.title"
                rules={{ required: "請輸入商品名稱" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>商品名稱</FormLabel>
                    <FormControl>
                      <Input placeholder="請輸入商品名稱" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="basicInfo.description"
                rules={{ required: "請輸入商品描述" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>商品描述</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="請描述商品特色、環境等資訊"
                        className="h-20"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="basicInfo.price"
                rules={{
                  required: "請輸入價格",
                  pattern: {
                    value: /^[0-9]*$/,
                    message: "請輸入有效的數字",
                  },
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>價格</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="請輸入價格"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="basicInfo.images"
                rules={{ required: "請上傳至少一張圖片" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>商品圖片</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value || []}
                        onChange={field.onChange}
                        onUpload={handleUpload}
                        maxFiles={10}
                      />
                    </FormControl>
                    <FormDescription>
                      最多上傳 10 張圖片，支援 PNG、JPG、JPEG 格式
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* 位置資訊 */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">位置資訊</h2>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="location.cemetery"
                rules={{ required: "請輸入墓園名稱" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>墓園名稱</FormLabel>
                    <FormControl>
                      <Input placeholder="請輸入墓園名稱" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="location.city"
                  rules={{ required: "請輸入城市" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>城市</FormLabel>
                      <FormControl>
                        <Input placeholder="請輸入城市" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location.district"
                  rules={{ required: "請輸入地區" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>地區</FormLabel>
                      <FormControl>
                        <Input placeholder="請輸入地區" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="location.address"
                rules={{ required: "請輸入詳細地址" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>詳細地址</FormLabel>
                    <FormControl>
                      <Input placeholder="請輸入詳細地址" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* 特徵資訊 */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">特徵資訊</h2>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="features.type"
                  rules={{ required: "請選擇塔位類型" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>塔位類型</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="請選擇塔位類型" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TYPE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="features.size"
                  rules={{ required: "請輸入尺寸" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>尺寸</FormLabel>
                      <FormControl>
                        <Input placeholder="例：50x50x50 cm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="features.facing"
                  rules={{ required: "請選擇方位" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>方位</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="請選擇方位" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {FACING_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="features.floor"
                  rules={{
                    required: "請輸入樓層",
                    pattern: {
                      value: /^[0-9]*$/,
                      message: "請輸入有效的數字",
                    },
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>樓層</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="請輸入樓層"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="features.religion"
                rules={{ required: "請選擇宗教屬性" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>宗教屬性</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="請選擇宗教屬性" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {RELIGION_OPTIONS.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* 法務資訊 */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">法務資訊</h2>
            <div className="grid gap-4">
              <FormField
                control={form.control}
                name="legalInfo.registrationNumber"
                rules={{ required: "請輸入登記編號" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>登記編號</FormLabel>
                    <FormControl>
                      <Input placeholder="請輸入登記編號" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* 送出按鈕 */}
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "處理中..." : "建立商品"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
