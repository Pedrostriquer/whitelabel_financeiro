import axios from "axios";

const BASE_ROUTE = process.env.REACT_APP_BASE_ROUTE;

const popUpService = {
  getAllActivePopUps: async (token = null) => {
    try {
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await axios.get(`${BASE_ROUTE}PopUp/all-active`, config);

      console.log(response.data)
      return response.data;
    } catch (error) {
      console.error("Error fetching all active popups:", error);
      return [];
    }
  },

  submitPopUpResponse: async (payload, token = null) => {
    try {
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await axios.post(
        `${BASE_ROUTE}PopUp/respond`,
        payload,
        config
      );
      return response.data;
    } catch (error) {
      console.error("Error submitting popup response:", error);
      throw error;
    }
  },

  getPopUpById: async (id, token = null) => {
    try {
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};
      const response = await axios.get(`${BASE_ROUTE}PopUp/${id}`, config);
      return response.data;
    } catch (error) {
      console.error("Error fetching popup by ID:", error);
      throw error;
    }
  },
};

export default popUpService;
