import { api } from "./api";

/**
 * Fetch venues (paged)
 * @param {Object} params { page, pageSize, active }
 * @returns {Promise<Object>} Raw response data
 */
export const getAllVenues = async (params = {}) => {
  const { page = 1, pageSize = 9, active = "ACTIVE" } = params;
  const query = {
    page: Math.max(0, Number(page) - 1),
    size: pageSize,
    active,
  };

  try {
    const response = await api.get("/fields", { params: query });
    return response.data;
  } catch (error) {
    console.error("Error fetching venues:", error);
    throw error;
  }
};

/**
 * Fetch venue detail for user view
 * @param {string} id field id
 */
export const getVenueDetail = async (id) => {
  if (!id) throw new Error("Missing field id");
  try {
    const response = await api.get(`/fields/${encodeURIComponent(id)}/user-detail`);
    return response.data;
  } catch (error) {
    console.error("Error fetching venue detail:", error);
    throw error;
  }
};

/**
 * Fetch bookings of a field by day (yyyy-MM-dd)
 * @param {string} id field id
 * @param {string} date ISO date string
 */
export const getFieldBookingsByDay = async (id, date) => {
  if (!id) throw new Error("Missing field id");
  try {
    const response = await api.get(`/bookings/field/${encodeURIComponent(id)}/by-day`, {
      params: { date },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching field bookings:", error);
    throw error;
  }
};

/**
 * Fetch field quantity (number of courts)
 * @param {string} id field id
 */
export const getFieldQuantity = async (id) => {
  if (!id) throw new Error("Missing field id");
  try {
    const response = await api.get(`/fields/${encodeURIComponent(id)}/quantity`);
    return response.data;
  } catch (error) {
    console.error("Error fetching field quantity:", error);
    throw error;
  }
};

/**
 * Fetch venues by filters (province, district, distance)
 * @param {Object} filters - Filter criteria { provinceId, areaId, distance }
 * @returns {Promise<Array>} Filtered list of venues
 */
export const searchVenues = async (filters) => {
    try {
        const response = await api.get("/venues/search", { params: filters });
        return response.data;
    } catch (error) {
        console.error("Error searching venues:", error);
        throw error;
    }
};

/**
 * Fetch venue by ID
 * @param {number} venueId - Venue ID
 * @returns {Promise<Object>} Venue details
 */
export const getVenueById = async (venueId) => {
    try {
        const response = await api.get(`/venues/${venueId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching venue:", error);
        throw error;
    }
};
