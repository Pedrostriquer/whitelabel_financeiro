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

  getBankAccountByClientId: async (clientId, token) => {
    try {
      const response = await axios.get(
        `${BASE_ROUTE}BankAccount/client/${clientId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao obter conta bancária:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  createBankAccount: async (accountData, token) => {
    try {
      const response = await axios.post(
        `${BASE_ROUTE}BankAccount`,
        accountData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao criar conta bancária:",
        error.response?.data || error.message
      );
      console.log(error);
      throw (
        error.response?.data ||
        new Error("Não foi possível criar a conta bancária.")
      );
    }
  },

  updateBankAccount: async (accountId, accountData, token) => {
    try {
      const response = await axios.put(
        `${BASE_ROUTE}BankAccount/${accountId}`,
        accountData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao atualizar conta bancária:",
        error.response?.data || error.message
      );
      throw (
        error.response?.data ||
        new Error("Não foi possível atualizar a conta bancária.")
      );
    }
  },

  uploadProfilePicture: async (id, file, token) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        `${BASE_ROUTE}client/${id}/profile-picture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao fazer upload da foto:",
        error.response?.data || error.message
      );
      throw (
        error.response?.data || new Error("Não foi possível enviar a foto.")
      );
    }
  },

  deleteProfilePicture: async (id, token) => {
    try {
      const response = await axios.delete(
        `${BASE_ROUTE}client/${id}/profile-picture`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Erro ao deletar a foto:",
        error.response?.data || error.message
      );
      throw (
        error.response?.data || new Error("Não foi possível deletar a foto.")
      );
    }
  },
};

export default clientServices;
