const axios = require("axios");

const enviarNotificacoes = async () => {
  try {
    const response = await axios.post(`${process.env.NOTIFICATION_SERVICE_URL}/notificacoes/enviar`);
    return response.data;
  } catch (error) {
    console.error("Erro ao enviar notificações:", error?.response?.data || error.message);
    throw new Error("Falha ao tentar enviar notificações");
  }
};

const buscarNotificacoes = async () => {
    try {
      const response = await axios.get(`${process.env.NOTIFICATION_SERVICE_URL}/notificacoes`);
      return response.data.notificacoes; // ✅ extrai diretamente o array
    } catch (error) {
      console.error("Erro ao buscar notificações:", error?.response?.data || error.message);
      throw new Error("Falha ao tentar buscar notificações");
    }
  };

module.exports = {
  enviarNotificacoes,
  buscarNotificacoes
};
