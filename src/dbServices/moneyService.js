import axios from "axios";

const API_URL = "https://economia.awesomeapi.com.br/json/last/USD-BRL";

const moneyService = {
  getDolarRate: async () => {
    try {
      const response = await axios.get(API_URL);
      return parseFloat(response.data.USDBRL.bid);
    } catch (error) {
      console.error("Erro ao buscar cotação do dólar:", error);
      return 5.0;
    }
  },
};

export default moneyService;
