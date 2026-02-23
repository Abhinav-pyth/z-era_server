const API_BASE = '/api';

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

export const getOrders = () =>
    fetch(`${API_BASE}/orders`, { headers: headers() }).then(handleRes);

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

// Tasks
export const getTasks = () =>
    fetch(`${API_BASE}/tasks`, { headers: headers() }).then(handleRes);

export const createTask = (data) =>
    fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(data)
    }).then(handleRes);

export const updateTask = (id, data) =>
    fetch(`${API_BASE}/tasks/${id}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(data)
    }).then(handleRes);

export const deleteTask = (id) =>
    fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE',
        headers: headers()
    }).then(handleRes);