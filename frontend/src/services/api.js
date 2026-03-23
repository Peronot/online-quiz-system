const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000/api";

const TOKEN_KEY = "just_quizz_token";
const USER_KEY = "just_quizz_user";
const STUDENT_KEY = "just_quizz_student";

async function apiRequest(path, options = {}) {
  const token = localStorage.getItem(TOKEN_KEY);
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-Requested-With": "XMLHttpRequest",
    ...(options.headers ?? {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers
    });
  } catch (error) {
    const networkError = new Error(
      "Network/CORS error. Please check backend server and CORS configuration."
    );
    networkError.status = 0;
    networkError.code = "NETWORK_ERROR";
    networkError.data = {};
    throw networkError;
  }

  const contentType = response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await response.json().catch(() => ({}))
    : { message: "Unexpected non-JSON response from API." };

  if (!response.ok) {
    const error = new Error(data.message || "Request failed.");
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

export function registerUser(payload) {
  return apiRequest("/register", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function loginUser(payload) {
  return apiRequest("/login", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function studentAccess(payload) {
  return apiRequest("/student/access", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function logoutUser() {
  return apiRequest("/logout", {
    method: "POST"
  });
}

export function getMe() {
  return apiRequest("/me");
}

export function getAdminDashboardSummary() {
  return apiRequest("/admin/dashboard/summary");
}

export function getTeacherDashboardSummary() {
  return apiRequest("/teacher/dashboard/summary");
}

export function getAdminUsers(params = {}) {
  const query = new URLSearchParams();

  if (params.status) query.set("status", params.status);
  if (params.role) query.set("role", params.role);
  if (params.search) query.set("search", params.search);

  const qs = query.toString();
  return apiRequest(`/admin/users${qs ? `?${qs}` : ""}`);
}

export function getAdminUserRoleSummary() {
  return apiRequest("/admin/users/roles/summary");
}

export function createAdminUser(payload) {
  return apiRequest("/admin/users", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateAdminUser(userId, payload) {
  return apiRequest(`/admin/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(payload)
  });
}

export function setAdminUserStatus(userId, isActive) {
  return apiRequest(`/admin/users/${userId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ is_active: Boolean(isActive) })
  });
}

export function deleteAdminUser(userId) {
  return apiRequest(`/admin/users/${userId}`, {
    method: "DELETE"
  });
}

export function setAuthData(token, user) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuthData() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function setStudentData(student) {
  localStorage.setItem(STUDENT_KEY, JSON.stringify(student));
}

export function clearStudentData() {
  localStorage.removeItem(STUDENT_KEY);
}

export function getStoredStudent() {
  const raw = localStorage.getItem(STUDENT_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY);
}
