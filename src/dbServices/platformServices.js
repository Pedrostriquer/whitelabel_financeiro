import axios from "axios";

const BASE_ROUTE = process.env.REACT_APP_BASE_ROUTE;

const platformServices = {
  getSidebarConfig: async (token) => {
    try {
      const response = await axios.get(`${BASE_ROUTE}platformconfig/sidebar`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching sidebar config:", error);
      throw error;
    }
  },
  updateSidebarItemState: async (itemName, avaliable, token) => {
    try {
      const response = await axios.patch(
        `${BASE_ROUTE}platformconfig/sidebar/${encodeURIComponent(itemName)}`,
        { avaliable },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    } catch (error) {
      console.error("Error updating sidebar item:", error);
      throw error;
    }
  },
};

export default platformServices;
