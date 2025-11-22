import { api } from "./api";

/**
 * Fetch venues (supports pagination params when backend is ready)
 * @param {Object} params optional query params (e.g., { page, pageSize, search })
 * @returns {Promise<Array|Object>} List or paged result from API
 */
export const getAllVenues = async (params = {}) => {
    try {
        const response = await api.get("/venues", { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching venues:", error);
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
