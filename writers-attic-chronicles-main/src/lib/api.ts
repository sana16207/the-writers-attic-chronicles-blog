import axios from "axios";

export const API_BASE_URL = "http://localhost:8081/api";

export const api = axios.create({ baseURL: API_BASE_URL });

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("wa_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    if (err?.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("wa_token");
      localStorage.removeItem("wa_user");
    }
    return Promise.reject(err);
  }
);

export type User = {
  id: string | number;
  name: string;
  email: string;
  role?: string;
};

export type Story = {
  id: string | number;
  title: string;
  content: string;

  authorName?: string;
  createdAt?: string;
  likes?: number;
  liked?: boolean;
  bookmarked?: boolean;
};

export type Comment = {
  id: string | number;
  content: string;
  author?: { name?: string } | string;
  authorName?: string;
  createdAt?: string;
};