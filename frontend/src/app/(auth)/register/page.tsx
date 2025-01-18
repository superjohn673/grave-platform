"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { authService } from "@/services/auth";

const registerSchema = z
  .object({
    email: z.string().email("請輸入有效的電子郵件"),
    password: z.string().min(6, "密碼至少需要6個字符"),
    confirmPassword: z.string(),
    name: z.string().min(2, "姓名至少需要2個字符"),
    phone: z.string().min(8, "請輸入有效的電話號碼"),
    role: z.enum(["buyer", "seller"], {
      required_error: "請選擇用戶類型",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "密碼不一致",
    path: ["confirmPassword"],
  });

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const registerData = {
        email: data.email,
        password: data.password,
        name: data.name,
        phone: data.phone,
        role: data.role || "buyer",
      };
      await authService.register(registerData);
      toast({
        title: "註冊成功",
        description: "請登入您的帳號",
      });
      router.push("/login");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "註冊失敗",
        description: error?.response?.data?.message || "請稍後再試",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">註冊帳號</CardTitle>
          <CardDescription className="text-center">
            請填寫以下資料以創建您的帳號
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="電子郵件"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-sm text-red-500">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="密碼"
                {...register("password")}
              />
              {errors.password && (
                <span className="text-sm text-red-500">
                  {errors.password.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="確認密碼"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <span className="text-sm text-red-500">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Input placeholder="姓名" {...register("name")} />
              {errors.name && (
                <span className="text-sm text-red-500">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Input placeholder="電話號碼" {...register("phone")} />
              {errors.phone && (
                <span className="text-sm text-red-500">
                  {errors.phone.message}
                </span>
              )}
            </div>
            <div className="space-y-2">
              <Select onValueChange={(value) => setValue("role", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="選擇用戶類型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="buyer">買家</SelectItem>
                  <SelectItem value="seller">賣家</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <span className="text-sm text-red-500">
                  {errors.role.message}
                </span>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "註冊中..." : "註冊"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            已有帳號？{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-500">
              立即登入
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
