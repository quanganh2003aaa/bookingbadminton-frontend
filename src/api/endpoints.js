export const API_BASE = "http://localhost:8080/api";

export const ENDPOINTS = {
  registerUser: `${API_BASE}/auth/register-user`,
  login: `${API_BASE}/auth/login`,
  refresh: `${API_BASE}/auth/refresh`,
  logout: `${API_BASE}/auth/logout`,
  registerOwner: `${API_BASE}/auth/register-owner`,
  verifyOtpRegister: `${API_BASE}/auth/verify-otp-register`,
  registerOwnerPasscode: `${API_BASE}/passcodes/register-owner`,
  registerOwnerConfirm: `${API_BASE}/register-owners/confirm`,
  loginOwner: `${API_BASE}/accounts/login/owner`,

  //ADMIN ENDPOINTS
  adminRegisterOwners: `${API_BASE}/admin/manage-register-owner`,
  adminRegisterOwnerDetail: (id) => `${API_BASE}/admin/${encodeURIComponent(id)}/detail-register-owner`,
  adminRegisterOwnerApprove: (id) => `${API_BASE}/admin/${encodeURIComponent(id)}/approve`,
  adminRegisterOwnerReject: (id) => `${API_BASE}/admin/${encodeURIComponent(id)}/reject`,
  adminUsers: `${API_BASE}/admin/manage-user`,
  adminFields: `${API_BASE}/admin/manage-field`,
  adminFieldDetail: (id) => `${API_BASE}/admin/${encodeURIComponent(id)}/detail-field`,
  accountLock: (id) => `${API_BASE}/accounts/${encodeURIComponent(id)}/lock`,
  accountUnlock: (id) => `${API_BASE}/accounts/${encodeURIComponent(id)}/unlock`,

  //OWNER ENDPOINTS
  ownerFields: `${API_BASE}/owner/fields`,
  ownerFieldDetail: (id) => `${API_BASE}/fields/owner/${encodeURIComponent(id)}`,
  ownerFieldDetailPublic: (id) => `${API_BASE}/fields/${encodeURIComponent(id)}/detail`,
  ownerFieldDetailByOwner: (id) => `${API_BASE}/owner/detail-field/${encodeURIComponent(id)}`,
  ownerFieldDetailWithOwner: (id, ownerId) =>
    `${API_BASE}/fields/owner/${encodeURIComponent(id)}?ownerId=${encodeURIComponent(ownerId)}`,
  ownerFieldUpdateByOwner: (id) => `${API_BASE}/fields/${encodeURIComponent(id)}/owner`,
  ownerFieldUpdateWithOwner: (id, ownerId) =>
    `${API_BASE}/fields/owner/${encodeURIComponent(id)}?ownerId=${encodeURIComponent(ownerId)}`,
  ownerFieldBookings: `${API_BASE}/owner/field-booking`,
  ownerFieldBookingDetail: (id) => `${API_BASE}/owner/field-booking/${encodeURIComponent(id)}`,
  ownerFieldBookingList: (id) => `${API_BASE}/owner/field-booking/${encodeURIComponent(id)}/list-booking`,
  ownerDetailInfo: `${API_BASE}/owner/detail-info`,

  // USER BOOKING
  bookingPending: `${API_BASE}/bookings/pending`,
  bookingPayDetail: (id) => `${API_BASE}/bookings/${encodeURIComponent(id)}/pay-detail`,
  userDetailInfo: `${API_BASE}/users/detail-info`,
  timeSlotsField: (id) => `${API_BASE}/time-slots/field/${encodeURIComponent(id)}`,
  fieldImageUpload: (id) => `${API_BASE}/fields/${encodeURIComponent(id)}/images/upload`,
  fieldImages: (id) => `${API_BASE}/fields/${encodeURIComponent(id)}/images`,
};
