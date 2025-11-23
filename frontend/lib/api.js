const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export async function getProducts(params = {}) {
  const queryString = new URLSearchParams(params).toString();
  return fetchAPI(`/products${queryString ? `?${queryString}` : ''}`);
}

export async function getProduct(slug) {
  return fetchAPI(`/products/${slug}`);
}

export async function getCategories() {
  return fetchAPI('/categories');
}

export async function getBrands() {
  return fetchAPI('/brands');
}

export async function getFeaturedProducts() {
  return fetchAPI('/products/featured');
}

export async function getNewArrivals() {
  return fetchAPI('/products/new-arrivals');
}

export async function searchProducts(query) {
  return fetchAPI(`/products/search?q=${encodeURIComponent(query)}`);
}
