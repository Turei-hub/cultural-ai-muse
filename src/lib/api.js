// Thin fetch wrapper for our Vercel API routes
const BASE = import.meta.env.DEV ? '' : ''

async function request(path, options = {}) {
  const res = await fetch(BASE + path, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

export const api = {
  // Products
  getProducts: (params = {}) => {
    const qs = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v != null && v !== ''))
    ).toString()
    return request(`/api/products${qs ? `?${qs}` : ''}`)
  },
  getProduct: (id) => request(`/api/products/${id}`),
  updateProduct: (id, data) => request(`/api/products/${id}`, { method: 'PATCH', body: data }),
  deleteProduct: (id) => request(`/api/products/${id}`, { method: 'DELETE' }),

  // Admin
  createProduct: (data) => request('/api/admin/products', { method: 'POST', body: data }),
  getCloudinarySignature: (folder) =>
    request('/api/admin/cloudinary-sign', { method: 'POST', body: { folder } }),

  // Orders
  getOrders: () => request('/api/orders'),

  // Checkout
  createCheckoutSession: (items, customerEmail) =>
    request('/api/checkout', { method: 'POST', body: { items, customerEmail } }),

  // Newsletter
  subscribe: (email) => request('/api/newsletter', { method: 'POST', body: { email } }),
}
