export const API_BASE = "http://localhost:8080/api";

export const ENDPOINTS = {
  registerUser: `${API_BASE}/accounts/register/user`,
  login: `${API_BASE}/accounts/login`,
  registerOwnerPasscode: `${API_BASE}/passcodes/register-owner`,
  registerOwnerConfirm: `${API_BASE}/register-owners/confirm`,
  adminRegisterOwners: `${API_BASE}/register-owners/admin`,
  adminRegisterOwnerDetail: (id) =>
    `${API_BASE}/register-owners/${encodeURIComponent(id)}/detail`,
  adminRegisterOwnerApprove: (id) =>
    `${API_BASE}/register-owners/${encodeURIComponent(id)}/approve`,
  adminRegisterOwnerReject: (id) =>
    `${API_BASE}/register-owners/${encodeURIComponent(id)}/reject`,
  adminUsers: `${API_BASE}/users/admin`,
  accountLock: (id) => `${API_BASE}/accounts/${encodeURIComponent(id)}/lock`,
  accountUnlock: (id) => `${API_BASE}/accounts/${encodeURIComponent(id)}/unlock`,
};
