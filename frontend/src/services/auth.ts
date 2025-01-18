import { api } from "@/lib/axios";
import type { LoginForm, RegisterForm, AuthResponse } from "@/types/auth";

export const authService = {
  async login(data: LoginForm) {
    const response = await api.post<AuthResponse>("/auth/login", data);
    // 設置 auth token 到 axios 默認請求頭
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${response.data.access_token}`;
    return response.data;
  },

  async register(data: RegisterForm) {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  async getProfile() {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  logout() {
    // 清除請求頭中的 token
    delete api.defaults.headers.common["Authorization"];
    // 清除 localStorage
    localStorage.removeItem("auth_token");
  },
};
