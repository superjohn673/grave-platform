"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";

export default function ProtectedRoute({
  children,
  allowedRoles = [],
}: {
  children: React.ReactNode;
  allowedRoles?: string[];
}) {
  const router = useRouter();
  const { user, token } = useAuthStore();

  useEffect(() => {
    if (!token) {
      router.replace("/login");
      return;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role || "")) {
      router.replace("/dashboard");
    }
  }, [token, user, router, allowedRoles]);

  if (!token) {
    return null;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role || "")) {
    return null;
  }

  return <>{children}</>;
}
