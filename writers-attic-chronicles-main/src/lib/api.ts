import axios from "axios";

export const API_BASE_URL = "http://localhost:8081/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// ========================
// AUTH INTERCEPTOR
// ========================
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("wa_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// ========================
// AUTO LOGOUT ON 401
// ========================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("wa_token");
      localStorage.removeItem("wa_user");
    }
    return Promise.reject(error);
  }
);

// ========================
// TYPES
// ========================
export type User = {
  id: string | number;
  name: string;
  email: string;
  role?: "USER" | "ADMIN" | string;
};

export type Story = {
  id: string | number;
  title: string;
  content: string;

  authorId?: string | number;
  authorName?: string;

  createdAt?: string;
  updatedAt?: string;

  likes?: number;
  liked?: boolean;
  bookmarked?: boolean;

  status?: string;
};

// backend Page<StoryResponse> support
export type PageResponse<T> = {
  content: T[];
  totalPages?: number;
  totalElements?: number;
  number?: number;
  size?: number;
};

export type Comment = {
  id: string | number;
  content: string;

  author?: { name?: string } | string;
  authorName?: string;

  createdAt?: string;
};