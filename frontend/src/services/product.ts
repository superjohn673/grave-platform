import { api } from "@/lib/axios";
import type { Product, ProductQuery, ProductsResponse } from "@/types/product";

export const productService = {
  async create(data: Partial<Product>) {
    const response = await api.post<Product>("/products", data);
    return response.data;
  },

  async getProducts(query: ProductQuery = {}) {
    const response = await api.get<ProductsResponse>("/products", {
      params: query,
    });
    return response.data;
  },

  async getMyListings(query: ProductQuery = {}) {
    const response = await api.get<ProductsResponse>("/products/my-listings", {
      params: query,
    });
    return response.data;
  },

  async getProduct(id: string) {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  },

  async updateProduct(id: string, data: Partial<Product>) {
    const response = await api.patch<Product>(`/products/${id}`, data);
    return response.data;
  },

  async deleteProduct(id: string) {
    await api.delete(`/products/${id}`);
  },

  async updateStatus(id: string, status: Product["status"]) {
    const response = await api.patch<Product>(`/products/${id}/status`, {
      status,
    });
    return response.data;
  },
};
