const formatServices = {
  formatCurrencyBR: (value) => {
    const number = Number(value);

    if (isNaN(number)) {
      return "0,00";
    }

    return new Intl.NumberFormat("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  },
  formatCpfCnpj: (value) => {
    if (!value) {
      return "";
    }

    const cleanedValue = String(value).replace(/\D/g, "");

    if (cleanedValue.length === 11) {
      return cleanedValue.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        "$1.$2.$3-$4"
      );
    }

    if (cleanedValue.length === 14) {
      return cleanedValue.replace(
        /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
        "$1.$2.$3/$4-$5"
      );
    }

    return cleanedValue;
  },
  formatData: (dateString) => {
    if (!dateString) {
      return "N/A";
    }
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Data inválida";
      }
      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).format(date);
    } catch (error) {
      console.error("Erro ao formatar data:", error);
      return "Data inválida";
    }
  },

  formatarPercentual: (valor) => {
    let valorStr = String(valor);
    valorStr = valorStr.replace(".", ",");
    valorStr = valorStr.replace(",", "#").replace(/,/g, "").replace("#", ",");
    if (!valorStr.includes("%")) {
      valorStr += "%";
    }
    return valorStr;
  },

  formatCurrencyInput: (value) => {
    if (!value) return "";

    const digitsOnly = value.toString().replace(/\D/g, "");
    if (digitsOnly === "") return "";

    const numberValue = parseInt(digitsOnly, 10) / 100;

    return numberValue.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  },

  parseCurrencyInput: (formattedValue) => {
    if (!formattedValue) return 0;

    const numericString = formattedValue
      .replace("R$", "")
      .replace(/\s/g, "")
      .replace(/\./g, "")
      .replace(",", ".");

    return parseFloat(numericString) || 0;
  },
};

export default formatServices;
