import { jwtDecode } from "jwt-decode";
import http from "./httpService";
import config from "../config.json";

const apiEndpoint = config.apiUrl + "/auth";
const tokenKey = "token";

http.setJwt(getJwt());

export async function login(email, password) {
  const response = await http.post(apiEndpoint, {
    email,
    password,
  });
  
  // Handle different response formats
  let jwt = null;
  
  // Check if token is in response header (axios lowercases header names)
  if (response.headers) {
    jwt = response.headers["x-auth-token"] || response.headers["X-Auth-Token"];
  }
  
  // Check if token is in response data (as string or object)
  if (!jwt && response.data) {
    if (typeof response.data === "string") {
      jwt = response.data;
    } else if (response.data.token) {
      jwt = response.data.token;
    } else if (response.data.jwt) {
      jwt = response.data.jwt;
    }
  }
  
  if (!jwt) {
    throw new Error("No token received from server. Please check backend response format.");
  }
  
  localStorage.setItem(tokenKey, jwt);
  http.setJwt(jwt);
  return jwt;
}

export function loginWithJwt(jwt) {
  localStorage.setItem(tokenKey, jwt);
  http.setJwt(jwt);
}

export function logout() {
  localStorage.removeItem(tokenKey);
  http.setJwt(null);
}

export function getCurrentUser() {
  try {
    const jwt = localStorage.getItem(tokenKey);
    if (!jwt) return null;
    return jwtDecode(jwt);
  } catch (ex) {
    // If JWT decoding fails, clear invalid token
    localStorage.removeItem(tokenKey);
    return null;
  }
}

export function getJwt() {
  return localStorage.getItem(tokenKey);
}

export default {
  login,
  loginWithJwt,
  logout,
  getCurrentUser,
  getJwt
};
