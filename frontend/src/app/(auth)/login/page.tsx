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
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth";

const loginSchema = z.object({
  email: z.string().email("請輸入有效的電子郵件"),
  password: z.string().min(6, "密碼至少需要6個字符"),
});

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      const response = await authService.login(data);

      // 設置 cookie
      document.cookie = `auth_token=${response.access_token}; path=/`;

      // 更新 store
      setToken(response.access_token);
      setUser(response.user);

      toast({
        title: "登入成功",
        description: "歡迎回來！",
      });

      // 延遲跳轉以確保 cookie 被設置
      setTimeout(() => {
        router.push("/dashboard");
      }, 100);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "登入失敗",
        description: error?.response?.data?.message || "請檢查您的帳號密碼",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">登入</CardTitle>
          <CardDescription className="text-center">
            歡迎回來，請登入您的帳號
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
                  {errors.email.message as string}
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
                  {errors.password.message as string}
                </span>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "登入中..." : "登入"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-gray-600">
            還沒有帳號？{" "}
            <Link
              href="/register"
              className="text-blue-600 hover:text-blue-500"
            >
              立即註冊
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
