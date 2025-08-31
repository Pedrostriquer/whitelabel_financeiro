import axios from "axios";

const API_URL = `${process.env.REACT_APP_BASE_ROUTE}offers`;

const getAuthHeaders = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

const offerService = {
  getOffers: async (token) => {
    const response = await axios.get(API_URL, getAuthHeaders(token));
    return response.data;
  },
};

export default offerService;