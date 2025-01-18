"use client";

import { useAuthStore } from "@/store/useAuthStore";

export default function DashboardHomePage() {
  const { user } = useAuthStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-4">
          歡迎回來，{user?.profile?.name}
        </h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {user?.role === "seller" ? (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="font-semibold mb-2">我的商品</h2>
              <p className="text-2xl">{user?.statistics?.listings || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="font-semibold mb-2">媒合次數</h2>
              <p className="text-2xl">{user?.statistics?.matches || 0}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="font-semibold mb-2">瀏覽次數</h2>
              <p className="text-2xl">{user?.statistics?.views || 0}</p>
            </div>
          </>
        ) : (
          <>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="font-semibold mb-2">收藏商品</h2>
              <p className="text-2xl">0</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="font-semibold mb-2">預約看塔</h2>
              <p className="text-2xl">0</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="font-semibold mb-2">洽談中</h2>
              <p className="text-2xl">0</p>
            </div>
          </>
        )}
      </div>

      {user?.role === "seller" && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="font-semibold mb-4">最近活動</h2>
          <div className="text-muted-foreground">尚無最近活動</div>
        </div>
      )}
    </div>
  );
}
