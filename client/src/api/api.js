const getApiBase = () => {
    let base = import.meta.env.VITE_API_URL || '/api';

    // If it's a relative path starting with /, use it as is
    if (base.startsWith('/')) return base;

    // If it starts with http, use it as is
    if (base.startsWith('http')) return base;

    // Handle hostnames / service names without protocol (common in Render Blueprints)
    // If it doesn't look like a full domain (no dot), assume it's a Render service name
    if (!base.includes('.')) {
        base = `${base}.onrender.com`;
    }

    // Ensure we have a protocol
    if (!base.startsWith('http')) {
        base = `https://${base}`;
    }

    // Ensure it ends with /api
    if (!base.endsWith('/api') && !base.includes('/api/')) {
        base = base.endsWith('/') ? `${base}api` : `${base}/api`;
    }

    return base;
};

const API_BASE = getApiBase();

const headers = () => {
    const h = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('z-era-token');
    if (token) h['Authorization'] = `Bearer ${token}`;
    return h;
};

const handleRes = async (res) => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Something went wrong');
    return data;
};

// Auth
export const signup = (body) =>
    fetch(`${API_BASE}/auth/signup`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handleRes);

export const login = (body) =>
    fetch(`${API_BASE}/auth/login`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handleRes);

export const getMe = () =>
    fetch(`${API_BASE}/auth/me`, { headers: headers() }).then(handleRes);

export const updateProfile = (body) =>
    fetch(`${API_BASE}/auth/profile`, { method: 'PUT', headers: headers(), body: JSON.stringify(body) }).then(handleRes);

// Products
export const getProducts = (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/products?${qs}`, { headers: headers() }).then(handleRes);
};

export const getFeaturedProducts = () =>
    fetch(`${API_BASE}/products/featured`, { headers: headers() }).then(handleRes);

export const getProduct = (id) =>
    fetch(`${API_BASE}/products/${id}`, { headers: headers() }).then(handleRes);

// Orders
export const placeOrder = (body) =>
    fetch(`${API_BASE}/orders`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handleRes);

// User's own order history
export const getOrders = () =>
    fetch(`${API_BASE}/orders/my`, { headers: headers() }).then(handleRes);

// Admin/Manager: Get all orders
export const getAllOrders = (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return fetch(`${API_BASE}/orders?${qs}`, { headers: headers() }).then(handleRes);
};

// Admin/Manager: Ship an order with tracking info
export const shipOrder = (id, body) =>
    fetch(`${API_BASE}/orders/${id}/ship`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handleRes);

// Admin: Update order status
export const updateOrderStatus = (id, status) =>
    fetch(`${API_BASE}/orders/${id}/status`, { method: 'PUT', headers: headers(), body: JSON.stringify({ status }) }).then(handleRes);

// Wishlist
export const getWishlist = () =>
    fetch(`${API_BASE}/wishlist`, { headers: headers() }).then(handleRes);

export const toggleWishlist = (product_id) =>
    fetch(`${API_BASE}/wishlist`, { method: 'POST', headers: headers(), body: JSON.stringify({ product_id }) }).then(handleRes);

// Reviews
export const getReviews = (productId) =>
    fetch(`${API_BASE}/reviews/product/${productId}`).then(handleRes);

export const submitReview = (body) =>
    fetch(`${API_BASE}/reviews`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handleRes);

// Config
export const getConfig = () =>
    fetch(`${API_BASE}/config`).then(handleRes);

// Coupons
export const validateCoupon = (code, amount) =>
    fetch(`${API_BASE}/coupons/validate`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ code, amount })
    }).then(handleRes);

// Analytics (Admin/Manager)
export const getAnalyticsStats = () =>
    fetch(`${API_BASE}/analytics/stats`, { headers: headers() }).then(handleRes);

export const exportOrdersReport = () =>
    fetch(`${API_BASE}/analytics/export`, { headers: headers() });

// Admin: Products management
export const updateProductStock = (id, stock) =>
    fetch(`${API_BASE}/products/${id}/stock`, { method: 'PUT', headers: headers(), body: JSON.stringify({ stock }) }).then(handleRes);

export const createProduct = (body) =>
    fetch(`${API_BASE}/products`, { method: 'POST', headers: headers(), body: JSON.stringify(body) }).then(handleRes);