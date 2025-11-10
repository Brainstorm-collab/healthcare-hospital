// apiClient
// ---------
// Minimal wrapper around fetch with base URL, query param building,
// and consistent JSON error handling.
const API_BASE_URL =
  import.meta.env.VITE_API_URL?.replace(/\/$/, "") ?? "http://localhost:8000/api";

const defaultHeaders = {
  "Content-Type": "application/json",
};

// Parse JSON when available; surface API-provided error messages.
const handleResponse = async (response) => {
  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const errorMessage =
      (isJson ? data?.error : undefined) ??
      (typeof data === "string" && data.length ? data : "Request failed");
    throw new Error(errorMessage);
  }

  return data;
};

// Build absolute URL from base + path; append non-empty query params.
const buildUrl = (path, params) => {
  const url = new URL(path.startsWith("http") ? path : `${API_BASE_URL}${path}`);
  if (params) {
    Object.entries(params)
      .filter(([, value]) => value !== undefined && value !== null && value !== "")
      .forEach(([key, value]) => {
        url.searchParams.set(key, String(value));
      });
  }
  return url.toString();
};

export const apiClient = {
  get: (path, params) =>
    fetch(buildUrl(path, params), {
      method: "GET",
    }).then(handleResponse),

  post: (path, body) =>
    fetch(buildUrl(path), {
      method: "POST",
      headers: defaultHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }).then(handleResponse),

  patch: (path, body) =>
    fetch(buildUrl(path), {
      method: "PATCH",
      headers: defaultHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }).then(handleResponse),

  put: (path, body) =>
    fetch(buildUrl(path), {
      method: "PUT",
      headers: defaultHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }).then(handleResponse),

  delete: (path, body) =>
    fetch(buildUrl(path), {
      method: "DELETE",
      headers: defaultHeaders,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }).then(handleResponse),
};

export const apiBaseUrl = API_BASE_URL;


