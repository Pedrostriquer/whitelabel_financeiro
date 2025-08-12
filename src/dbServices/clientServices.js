import axios from "axios";

const BASE_ROUTE = process.env.REACT_APP_BASE_ROUTE;

const clientServices = {
  editClient: async (id, updates, token) => {
    try {
      const response = await axios.patch(`${BASE_ROUTE}client/${id}`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error) {
      console.log(error);

      throw error;
    }
  },
  informacoesCarteira: async (token) => {
    try {
      const response = await axios.get(
        `${BASE_ROUTE}withdraw/client/wallet-info`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);

      throw error;
    }
  },
  cadastrar: async (info) => {
    try {
      const response = await axios.post(`${BASE_ROUTE}client`, info);
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao cadastrar cliente:",
        error.response?.data || error.message
      );
      throw (
        error.response?.data ||
        new Error("Não foi possível completar o cadastro.")
      );
    }
  },

  requestPasswordReset: async (email) => {
    try {
      const response = await axios.post(
        `${BASE_ROUTE}verification/forgot-password`,
        { email }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao solicitar redefinição de senha:",
        error.response?.data || error.message
      );
      throw (
        error.response?.data ||
        new Error("Não foi possível solicitar a redefinição de senha.")
      );
    }
  },

  resetPassword: async (verificationCode, newPassword) => {
    try {
      const response = await axios.post(`${BASE_ROUTE}client/reset-password`, {
        verificationCode,
        newPassword,
      });
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao redefinir senha:",
        error.response?.data || error.message
      );
      throw (
        error.response?.data || new Error("Não foi possível redefinir a senha.")
      );
    }
  },
};

export default clientServices;
