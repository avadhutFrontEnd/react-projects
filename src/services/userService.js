import http from "./httpService";
import config from "../config.json";

const apiEndpoint = config.apiUrl + "/users";

export function register(user) {
  return http.post(apiEndpoint, {
    email: user.username,
    password: user.password,
    name: user.name,
  });
}

export function getCurrentUser() {
  return http.get(apiEndpoint + "/me");
}

// Get all users (admin only)
export function getUsers(filters = {}) {
  const queryParams = new URLSearchParams(filters).toString();
  return http.get(apiEndpoint + (queryParams ? `?${queryParams}` : ""));
}

// Verify user
export function verifyUser(userId, data = {}) {
  return http.patch(`${apiEndpoint}/${userId}/verify`, data);
}

// Revoke user access
export function revokeUser(userId) {
  return http.patch(`${apiEndpoint}/${userId}/revoke`);
}

// Activate user
export function activateUser(userId) {
  return http.patch(`${apiEndpoint}/${userId}/activate`);
}

// Reject user
export function rejectUser(userId) {
  return http.patch(`${apiEndpoint}/${userId}/reject`);
}

// Delete user
export function deleteUser(userId) {
  return http.delete(`${apiEndpoint}/${userId}`);
}

// Update user role
export function updateUserRole(userId, role) {
  return http.patch(`${apiEndpoint}/${userId}/role`, { role });
}

// Update user credits
export function updateUserCredits(userId, credits, operation = "set") {
  return http.patch(`${apiEndpoint}/${userId}/credits`, { credits, operation });
}