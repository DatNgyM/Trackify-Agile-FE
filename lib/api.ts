import axios, { type AxiosInstance } from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api";

/** Lấy JWT từ nơi lưu (localStorage). Có thể đổi sang cookie / NextAuth session. */
function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

/** Axios instance: tự gắn JWT vào mỗi request. */
export const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

/** Auth API (mock hoặc thay bằng endpoint BE thật). */
export const authApi = {
  login: (email: string, password: string) =>
    api.post<{ token: string; user: { id: string; email: string; name: string } }>("/auth/login", {
      email,
      password,
    }),
  register: (name: string, email: string, password: string) =>
    api.post<{ token: string; user: { id: string; email: string; name: string } }>(
      "/auth/register",
      { name, email, password }
    ),
};
