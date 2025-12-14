import { getToken } from "./storage";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL!;

async function request<T>(
  path: string,
  method: string,
  body?: any
): Promise<T> {
  const token = await getToken();

  const headers: any = {
    Accept: "application/json",
  };

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Error en API");
  }

  return data;
}

/* ================= AUTH ================= */

export async function apiLogin(email: string, password: string) {
  const res = await request<{ success: boolean; data: { token: string } }>(
    "/auth/login",
    "POST",
    { email, password }
  );

  return { token: res.data.token };
}

/* ================= TODOS ================= */

export type ApiTodo = {
  id: number;
  title: string;
  completed: boolean;
  latitude?: number;
  longitude?: number;
};

export async function apiGetTodos() {
  return request<ApiTodo[]>("/todos", "GET");
}

export async function apiCreateTodo(payload: {
  title: string;
  latitude?: number;
  longitude?: number;
}) {
  return request<ApiTodo>("/todos", "POST", payload);
}

export async function apiUpdateTodo(
  id: number,
  payload: Partial<{ title: string; completed: boolean }>
) {
  return request<ApiTodo>(`/todos/${id}`, "PATCH", payload);
}

export async function apiDeleteTodo(id: number) {
  return request(`/todos/${id}`, "DELETE");
}
