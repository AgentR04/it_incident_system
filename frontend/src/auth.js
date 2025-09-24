// Simple token helpers stored in localStorage
export const TOKEN_KEY = "jwt_token";

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}
