// /src/helpers/cpfValidator.js

import axios from "axios";
import verifications from "./verifications";

const documentValidator = {
  convertToInputDate: (dateString) => {
    if (!dateString || !dateString.includes('/')) {
        return "";
    }
    const [day, month, year] = dateString.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  },

  validateCPF: async (cpf) => {
    const cleanedCPF = cpf.replace(/\D/g, "");
    if (!verifications.testaCPF(cleanedCPF)) {
      throw new Error("CPF inválido");
    }
    try {
      const url = `https://ws.hubdodesenvolvedor.com.br/v2/cpf/?cpf=${cleanedCPF}&token=${process.env.REACT_APP_HUB_DEVELOPERS_API_KEY}`;
      const response = await axios.post(url);
      const data = response.data;
      if (data.status !== true) {
        throw new Error(data.return || "Erro ao validar CPF.");
      }
      const result = data.result;
      if (!result || !result.nome_da_pf || !result.data_nascimento) {
        throw new Error("Dados não encontrados para o CPF informado.");
      }
      return { 
        success: true, 
        name: result.nome_da_pf, 
        birthDate: documentValidator.convertToInputDate(result.data_nascimento)
      };
    } catch (error) {
       if (axios.isAxiosError(error) && error.response) {
         throw new Error(error.response.data.return || 'Serviço de validação indisponível');
      }
      throw error;
    }
  },

  validateCNPJ: async (cnpj) => {
    const cleanedCNPJ = cnpj.replace(/\D/g, "");
    if (!verifications.testaCNPJ(cleanedCNPJ)) {
        throw new Error("CNPJ inválido");
    }
    try {
        const url = `https://ws.hubdodesenvolvedor.com.br/v2/cnpj/?cnpj=${cleanedCNPJ}&token=${process.env.REACT_APP_HUB_DEVELOPERS_API_KEY}`;
        const response = await axios.post(url);
        const data = response.data;
        if (data.status !== true) {
            throw new Error(data.return || "Erro ao validar CNPJ.");
        }
        const result = data.result;
        if (!result || !result.nome) {
            throw new Error("Dados não encontrados para o CNPJ informado.");
        }
        
        const address = {};
        if (result.logradouro && result.cep) {
            address.street = result.logradouro;
            address.number = result.numero;
            address.complement = result.complemento;
            address.neighborhood = result.bairro;
            address.city = result.municipio;
            address.state = result.uf;
            address.cep = result.cep.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2");
        }

        return {
            success: true,
            name: result.fantasia || result.nome,
            birthDate: documentValidator.convertToInputDate(result.abertura),
            address: address.street ? address : null
        };
    } catch (error) {
       if (axios.isAxiosError(error) && error.response) {
         throw new Error(error.response.data.return || 'Serviço de validação indisponível');
      }
      throw error;
    }
  }
};

export default documentValidator;