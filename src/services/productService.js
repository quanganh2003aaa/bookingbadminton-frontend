const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8080";

export async function fetchProducts() {
  const res = await fetch(`${API_BASE}/api/products`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error: ${res.status} ${text}`);
  }
  return res.json();
}

export async function fetchProductById(id) {
  const res = await fetch(`${API_BASE}/api/products/${id}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API error: ${res.status} ${text}`);
  }
  return res.json();
}