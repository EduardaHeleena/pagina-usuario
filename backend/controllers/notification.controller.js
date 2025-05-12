/*const NotificationService = require("../services/notification.service");

const enviarNotificacoes = async (req, res) => {
  try {
    const resultado = await NotificationService.enviarNotificacoes();
    res.json({ sucesso: true, resultado });
  } catch (error) {
    console.error("Erro ao enviar notificações:", error.message);
    res.status(500).json({ erro: "Erro ao enviar notificações" });
  }
};

const buscarNotificacoes = async (req, res) => {
  try {
    const notificacoes = await NotificationService.buscarNotificacoes();
    res.json({ sucesso: true, notificacoes });
  } catch (error) {
    console.error("Erro ao buscar notificações:", error.message);
    res.status(500).json({ erro: "Erro ao buscar notificações" });
  }
};

module.exports = {
  enviarNotificacoes,
  buscarNotificacoes
};*/
