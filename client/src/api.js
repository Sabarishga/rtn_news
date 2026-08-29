const BASE_URL = "/api";

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const subscribe = (email, categories, frequency) =>
  request("/subscribe", {
    method: "POST",
    body: JSON.stringify({ email, categories, frequency }),
  });

export const unsubscribe = (email) =>
  request("/unsubscribe", {
    method: "POST",
    body: JSON.stringify({ email }),
  });

export const getPreferences = (email) =>
  request(`/preferences/${encodeURIComponent(email)}`);

export const updatePreferences = (email, categories, frequency) =>
  request(`/preferences/${encodeURIComponent(email)}`, {
    method: "PUT",
    body: JSON.stringify({ categories, frequency }),
  });

export const getNotifications = (email) =>
  request(`/notifications/${encodeURIComponent(email)}`);

export const clearNotifications = (email) =>
  request(`/notifications/${encodeURIComponent(email)}`, {
    method: "DELETE",
  });
