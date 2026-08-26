import type { AuthSession } from "@/contracts";
import { useAuthStore } from "@/stores/auth.store";

const API_BASE_URL = `${(process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "")}/api/v1`;

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly errors?: Record<string, string[]>;

  constructor(
    status: number,
    code: string,
    message: string,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.errors = errors;
  }
}

export type QueryValue = string | number | boolean | undefined | null | string[];
export type QueryParams = Record<string, QueryValue>;

function buildQueryString(params?: QueryParams): string {
  if (!params) return "";
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    if (Array.isArray(value)) {
      for (const item of value) search.append(key, item);
      continue;
    }
    search.append(key, typeof value === "boolean" ? String(value) : String(value));
  }
  const qs = search.toString();
  return qs ? `?${qs}` : "";
}

interface ParsedErrorBody {
  message?: string;
  code?: string;
  errors?: Record<string, string[]>;
}

async function parseError(response: Response): Promise<ApiError> {
  let body: ParsedErrorBody | null = null;
  try {
    body = (await response.json()) as ParsedErrorBody;
  } catch {
    body = null;
  }
  return new ApiError(
    response.status,
    body?.code ?? "UNKNOWN_ERROR",
    body?.message ?? response.statusText ?? "Erro desconhecido.",
    body?.errors,
  );
}

let refreshPromise: Promise<AuthSession | null> | null = null;

function refreshSession(): Promise<AuthSession | null> {
  const refreshToken = useAuthStore.getState().session?.refreshToken;
  if (!refreshToken) return Promise.resolve(null);

  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ refreshToken }),
    })
      .then(async (res) => (res.ok ? ((await res.json()) as AuthSession) : null))
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  query?: QueryParams;
  /** Anexa Authorization + tenta refresh em 401. Default true. */
  auth?: boolean;
  headers?: Record<string, string>;
}

/**
 * Numa carga fria, a sessão persistida (zustand/persist) ainda não terminou de
 * reidratar do localStorage no primeiro tick — disparar antes disso manda a
 * requisição sem Authorization (silenciosamente anônima em rotas com auth
 * opcional, como /cart). Espera reidratar antes de montar os headers.
 */
function waitForAuthHydration(): Promise<void> {
  if (useAuthStore.persist.hasHydrated()) return Promise.resolve();
  return new Promise((resolve) => {
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      unsubscribe();
      resolve();
    });
  });
}

async function performFetch(path: string, options: RequestOptions): Promise<Response> {
  await waitForAuthHydration();
  const headers: Record<string, string> = { Accept: "application/json", ...options.headers };
  const accessToken = useAuthStore.getState().session?.accessToken;
  if (options.auth !== false && accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  let body: BodyInit | undefined;
  if (options.body instanceof FormData) {
    body = options.body;
  } else if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }

  return fetch(`${API_BASE_URL}${path}${buildQueryString(options.query)}`, {
    method: options.method ?? "GET",
    headers,
    body,
  });
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  let response = await performFetch(path, options);

  if (response.status === 401 && options.auth !== false) {
    const refreshed = await refreshSession();
    if (refreshed) {
      useAuthStore.getState().setSession(refreshed);
      response = await performFetch(path, options);
    } else {
      useAuthStore.getState().logout();
    }
  }

  if (!response.ok) {
    throw await parseError(response);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export function apiGet<T>(
  path: string,
  query?: QueryParams,
  options?: Pick<RequestOptions, "auth" | "headers">,
): Promise<T> {
  return request<T>(path, { method: "GET", query, ...options });
}

export function apiPost<T>(
  path: string,
  body?: unknown,
  options?: Pick<RequestOptions, "auth" | "query" | "headers">,
): Promise<T> {
  return request<T>(path, { method: "POST", body, ...options });
}

export function apiPut<T>(
  path: string,
  body?: unknown,
  options?: Pick<RequestOptions, "auth" | "headers">,
): Promise<T> {
  return request<T>(path, { method: "PUT", body, ...options });
}

export function apiPatch<T>(
  path: string,
  body?: unknown,
  options?: Pick<RequestOptions, "auth" | "headers">,
): Promise<T> {
  return request<T>(path, { method: "PATCH", body, ...options });
}

export function apiDelete<T = void>(
  path: string,
  options?: Pick<RequestOptions, "auth" | "headers">,
): Promise<T> {
  return request<T>(path, { method: "DELETE", ...options });
}

/** Como apiGet, mas devolve null em 404 em vez de lançar (para rotas "buscar por slug/código"). */
export async function getOrNull<T>(
  path: string,
  query?: QueryParams,
  options?: Pick<RequestOptions, "auth">,
): Promise<T | null> {
  try {
    return await apiGet<T>(path, query, options);
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}
