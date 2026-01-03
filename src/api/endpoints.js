export const API_BASE = "http://localhost:8080/api";

export const ENDPOINTS = {
  registerUser: `${API_BASE}/accounts/register/user`,
  login: `${API_BASE}/accounts/login`,
  registerOwnerPasscode: `${API_BASE}/passcodes/register-owner`,
  registerOwnerConfirm: `${API_BASE}/register-owners/confirm`,
  loginOwner: `${API_BASE}/accounts/login/owner`,

  //ADMIN ENDPOINTS
  adminRegisterOwners: `${API_BASE}/admin/list-register-owner`,
  adminRegisterOwnerDetail: (id) => `${API_BASE}/admin/${encodeURIComponent(id)}/detail-register-owner`,
  adminRegisterOwnerApprove: (id) => `${API_BASE}/admin/${encodeURIComponent(id)}/approve-register-owner`,
  adminRegisterOwnerReject: (id) => `${API_BASE}/admin/${encodeURIComponent(id)}/reject-register-owner`,
  adminUsers: `${API_BASE}/admin/list-users`,
  adminFields: `${API_BASE}/admin/list-fields`,
  adminFieldDetail: (id) => `${API_BASE}/admin/${encodeURIComponent(id)}/detail-field`,
  accountLock: (id) => `${API_BASE}/accounts/${encodeURIComponent(id)}/lock`,
  accountUnlock: (id) => `${API_BASE}/accounts/${encodeURIComponent(id)}/unlock`,

  //OWNER ENDPOINTS
  ownerFields: `${API_BASE}/owner/fields`,
  ownerFieldDetail: (id) => `${API_BASE}/fields/owner/${encodeURIComponent(id)}`,
  ownerFieldDetailWithOwner: (id, ownerId) =>
    `${API_BASE}/fields/owner/${encodeURIComponent(id)}?ownerId=${encodeURIComponent(ownerId)}`,
  ownerFieldUpdateWithOwner: (id, ownerId) =>
    `${API_BASE}/owner/fields/${encodeURIComponent(id)}?ownerId=${encodeURIComponent(ownerId)}`,
  ownerFieldBookings: `${API_BASE}/fields/owner/bookings`,
  timeSlotsField: (id) => `${API_BASE}/time-slots/field/${encodeURIComponent(id)}`,
  fieldImageUpload: (id) => `${API_BASE}/fields/${encodeURIComponent(id)}/images/upload`,
  fieldImages: (id) => `${API_BASE}/fields/${encodeURIComponent(id)}/images`,
};
