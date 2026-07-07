// Sesión demo simulada (sin backend). Se guarda en localStorage.
const SESSION_KEY = "schoolpay-rd-session";

export function login(email: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify({ email, ts: Date.now() }));
}

export function logout() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;
  return !!window.localStorage.getItem(SESSION_KEY);
}
