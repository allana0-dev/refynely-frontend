import { auth } from "./firebase";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const headers = new Headers(opts.headers);

  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = `${API_BASE.replace(/\/$/, "")}/api/${path.replace(/^\//, "")}`;

  const res = await fetch(url, {
    ...opts,
    headers,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API Error ${res.status}: ${text}`);
  }

  // Check if response has content and is JSON
  const contentType = res.headers.get("content-type");
  const contentLength = res.headers.get("content-length");

  // If no content or empty response
  if (contentLength === "0" || !contentType?.includes("application/json")) {
    console.log("Empty or non-JSON response");
    return {} as T; // Return empty object for empty responses
  }

  // Check if response body is empty
  const text = await res.text();
  if (!text.trim()) {
    console.log("Empty response body");
    return {} as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch (parseError) {
    console.error("JSON Parse Error:", parseError);
    console.error("Response text:", text);
    throw new Error(`Invalid JSON response: ${text}`);
  }
}

export default {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),

  post: <T>(path: string, body: any) => {
    // Handle FormData differently (don't stringify or set Content-Type)
    if (body instanceof FormData) {
      return request<T>(path, {
        method: "POST",
        body,
      });
    }

    // Handle regular JSON
    return request<T>(path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  },

  put: <T>(path: string, body: any) =>
    request<T>(path, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),

  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
