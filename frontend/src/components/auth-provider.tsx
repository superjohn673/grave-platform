"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

const publicRoutes = ["/login", "/register"];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token } = useAuthStore();

  useEffect(() => {
    // 如果未登入且不在公開路徑，重定向到登入頁
    if (!token && !publicRoutes.includes(pathname)) {
      router.push("/login");
    }

    // 如果已登入且在公開路徑，重定向到主面板
    if (token && publicRoutes.includes(pathname)) {
      router.push("/dashboard");
    }
  }, [token, pathname, router]);

  return children;
}
