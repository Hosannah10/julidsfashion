import axios from "axios";

export const DUMMY_BASE = 'http://127.0.0.1:8000/api';

// helper to get fetch headers (for fetch-based calls)
export function getAuthFetchHeaders(contentType = "application/json") {
  const token = localStorage.getItem("token");
  const headers: Record<string, string> = {};
  if (contentType) headers["Content-Type"] = contentType;
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

// helper to get axios config with Authorization
export function getAxiosConfig() {
  const token = localStorage.getItem("token");
  return {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  };
}

async function safeJson(res: Response) {
  const txt = await res.text();
  try { return JSON.parse(txt); } catch { return txt; }
}

export async function fetchProducts() {
  const r = await fetch(`${DUMMY_BASE}/wears/`);
  if (!r.ok) throw new Error('fetchWears failed');
  return safeJson(r);
}

export async function fetchProduct(id: string | number) {
  const r = await fetch(`${DUMMY_BASE}/wears/${id}/`);
  if (!r.ok) throw new Error('fetchWear failed');
  return safeJson(r);
}

export async function fetchCart(userId?: string) {
  const qs = userId ? `?userId=${encodeURIComponent(userId)}` : '';
  const r = await fetch(`${DUMMY_BASE}/cart${qs}`, { headers: getAuthFetchHeaders() });
  if (!r.ok) throw new Error('fetchCart failed');
  return safeJson(r);
}

export async function addToCartApi(item: any) {
  const r = await fetch(`${DUMMY_BASE}/cart/add`, {
    method: 'POST',
    headers: getAuthFetchHeaders(),
    body: JSON.stringify(item),
  });
  if (!r.ok) throw new Error('addToCartApi failed');
  return safeJson(r);
}

export async function updateCartItemApi(id: any, body: any) {
  // prefer RESTful path-based update (Django compatible)
  const r = await fetch(`${DUMMY_BASE}/cart/update/${id}/`, {
    method: 'PUT',
    headers: getAuthFetchHeaders(),
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error('updateCartItemApi failed');
  return safeJson(r);
}

export async function removeCartItemApi(id: any) {
  const r = await fetch(`${DUMMY_BASE}/cart/remove/${id}/`, {
    method: 'DELETE',
    headers: getAuthFetchHeaders()
  });
  if (!r.ok) throw new Error('removeCartItemApi failed');
  return safeJson(r);
}

export async function clearCartApi() {
  const r = await fetch(`${DUMMY_BASE}/cart/clear`, {
    method: 'POST',
    headers: getAuthFetchHeaders(),
  });
  if (!r.ok) throw new Error('clearCartApi failed');
  return safeJson(r);
}

export async function checkout(body: any) {
  // protected endpoint — token must be present
  const r = await fetch(`${DUMMY_BASE}/shop-orders/`, {
    method: 'POST',
    headers: getAuthFetchHeaders(), // will include Authorization if token present
    body: JSON.stringify(body),
  });
  if (!r.ok) {
    const txt = await safeJson(r);
    const errMsg = (txt && (txt.detail || txt.message)) || 'checkoutApi failed';
    throw new Error(errMsg);
  }
  return safeJson(r);
}

export async function fetchShopOrders(email?: any) {
  const qs = email ? `?email=${encodeURIComponent(email)}` : '';
  const r = await fetch(`${DUMMY_BASE}/shop-orders/${qs}`, {
    headers: getAuthFetchHeaders(),
  });
  if (!r.ok) throw new Error('fetchOrdersApi failed');
  return safeJson(r);
}

//  Email Notifications to both user and admin
// For checkout after creating shop order(s)
export async function notifyShopOrderPlaced( id: string | number, email: string ) {
  const r = await fetch(`${DUMMY_BASE}/notifications/shop-order-placed/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, email }),
  });
  if (!r.ok) {
    const txt = await safeJson(r).catch(() => ({}));
    const errMsg = (txt && (txt.detail || txt.message)) || 'notifyShopOrderPlaced failed';
    throw new Error(errMsg);
  }
  return safeJson(r);
}

//  Email Notifications to user
export async function notifyShopOrderCompleted( id?: string | number, email?: string ) {
  const r = await fetch(`${DUMMY_BASE}/notifications/shop-order-completed/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, email }),
  });
  if (!r.ok) throw new Error('notifyShopOrderCompleted failed');
  return safeJson(r);
}


// Custom Orders using axios (axios will have Authorization header set by AuthContext.login)
export const createCustomOrder = async (formDataObj: any) => {
  try {
    const res = await axios.post(`${DUMMY_BASE}/custom-orders/`, formDataObj, getAxiosConfig());
    return res.data;
  } catch (error) {
    console.error("Error creating custom order:", error);
    throw error;
  }
};

//  Email Notifications to both user and admin
// notifyCustomOrderPlaced: POST body { email } (instead of encoding email in URL)
export const notifyCustomOrderPlaced = async (email: string) => {
  try {
    const response = await axios.post(`${DUMMY_BASE}/notifications/custom-order-placed/`, { email });
    return response.data;
  } catch (error) {
    console.error("Error sending custom order notification:", error);
    throw error;
  }
};


export const fetchCustomOrders = async (email: string) => {
  try {
    const res = await axios.get(`${DUMMY_BASE}/custom-orders/?email=${encodeURIComponent(email)}`, getAxiosConfig());
    return res.data;
  } catch (error) {
    console.error("Error fetching user custom orders:", error);
    throw error;
  }
};

// Cancel (delete) a shop order (user or admin) - RESTful detail delete
export async function deleteShopOrder(id: number | string) {
  const r = await fetch(`${DUMMY_BASE}/shop-orders/${id}/`, {
    method: "DELETE",
    headers: getAuthFetchHeaders(), // includes Authorization if token exists
  });
  if (!r.ok) {
    const txt = await safeJson(r).catch(() => ({}));
    const errMsg = (txt && (txt.detail || txt.message)) || 'deleteShopOrder failed';
    throw new Error(errMsg);
  }
  return safeJson(r);
}

// Cancel (delete) a custom order (user or admin)
export async function deleteCustomOrder(id: number | string) {
  const r = await fetch(`${DUMMY_BASE}/custom-orders/${id}/`, {
    method: "DELETE",
    headers: getAuthFetchHeaders(),
  });
  if (!r.ok) {
    const txt = await safeJson(r).catch(() => ({}));
    const errMsg = (txt && (txt.detail || txt.message)) || 'deleteCustomOrder failed';
    throw new Error(errMsg);
  }
  return safeJson(r);
}

