const API_URL = process.env.NEXT_PUBLIC_API_URL;

// One reusable wrapper around fetch for talking to our Express API.
// - Prefixes the base URL
// - Attaches the JWT from localStorage (if present)
// - Parses JSON and throws a clean Error on failure
export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const res = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  // Some responses (e.g. errors) may not have a JSON body — guard against it
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}
