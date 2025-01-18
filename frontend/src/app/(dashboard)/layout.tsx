"use client";

import { useAuthStore } from "@/store/useAuthStore";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  MessageSquare,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";

const navigation = [
  {
    name: "儀表板",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["buyer", "seller"],
  },
  {
    name: "商品管理",
    href: "/dashboard/products",
    icon: Package,
    roles: ["seller"],
  },
  {
    name: "商品列表",
    href: "/products",
    icon: Package,
    roles: ["buyer"],
  },
  {
    name: "媒合管理",
    href: "/dashboard/matches",
    icon: MessageSquare,
    roles: ["buyer", "seller"],
  },
  {
    name: "預約管理",
    href: "/dashboard/bookings",
    icon: Calendar,
    roles: ["buyer", "seller"],
  },
  {
    name: "設定",
    href: "/dashboard/settings",
    icon: Settings,
    roles: ["buyer", "seller"],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  // 根據用戶角色過濾導航項目
  const filteredNavigation = navigation.filter((item) =>
    item.roles.includes(user?.role || "")
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex h-screen bg-gray-100">
        {/* Sidebar */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r">
              <div className="flex flex-col flex-grow">
                <nav className="flex-1 px-2 pb-4 space-y-1">
                  {filteredNavigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                          isActive
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "mr-3 flex-shrink-0 h-6 w-6",
                            isActive
                              ? "text-gray-500"
                              : "text-gray-400 group-hover:text-gray-500"
                          )}
                        />
                        {item.name}
                      </Link>
                    );
                  })}
                </nav>
                <div className="flex-shrink-0 p-4 border-t">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900 group"
                  >
                    <LogOut className="mr-3 h-6 w-6 text-gray-400 group-hover:text-gray-500" />
                    登出
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          <main className="flex-1 relative overflow-y-auto focus:outline-none">
            <div className="py-6">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
