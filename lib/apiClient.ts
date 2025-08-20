// app/lib/apiClient.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from "axios";

// читаємо з .env
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

if (!BASE_URL) {
  // допоможе швидко зрозуміти, що не підставилась змінна оточення
  // (працює тільки під час деву)
  // eslint-disable-next-line no-console
  console.warn("[apiClient] NEXT_PUBLIC_API_URL is not defined");
}

const api: AxiosInstance = axios.create({
  baseURL: BASE_URL, // напр. "https://notehub-public.goit.study/api"
  timeout: 15000,
});

// додаємо Authorization якщо є токен
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (TOKEN) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${TOKEN}`;
  }
  return config;
});

export default api;
