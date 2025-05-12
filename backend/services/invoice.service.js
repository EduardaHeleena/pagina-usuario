const axios = require("axios");

const getOpenInvoices = async (clienteId) => {
  try {
    const response = await axios.get(`${process.env.INVOICE_SERVICE_URL}/faturas-abertas/${clienteId}`);

    return mapInvoices(response);
  } catch (error) {
    console.error("Erro ao buscar faturas em aberto:", error);
    throw new Error("Não foi possível recuperar faturas em aberto");
  }
};

const getLateInvoices = async (clienteId) => {
  try {
    const response = await axios.get(`${process.env.INVOICE_SERVICE_URL}/faturas-atraso/${clienteId}`);

    return mapInvoices(response);
  } catch (error) {
    console.error("Erro ao buscar faturas em atraso:", error);
    throw new Error("Não foi possível recuperar faturas em atraso");
  }
};

const getPaidInvoices = async (clienteId) => {
  try {
    const response = await axios.get(`${process.env.INVOICE_SERVICE_URL}/faturas-pagas/${clienteId}`);

    return mapInvoices(response);
  } catch (error) {
    console.error("Erro ao buscar faturas pagas:", error);
    throw new Error("Não foi possível recuperar faturas pagas");
  }
};

const mapInvoices = (response) => {
  const invoices = response.data.invoices || response.data || [];

  const faturas = invoices.map(invoice => ({
    id: invoice.id,
    cliente_id: invoice.id_client,
    numero_fatura: invoice.invoice_number,
    valor: invoice.amount,
    data_emissao: invoice.issue_date,
    data_vencimento: invoice.due_date,
    pago_com_atraso: invoice.payment_date !== null && invoice.payment_date > invoice.due_date,
    juros: invoice.fees,
    data_liquidacao: invoice.payment_date,
    boleto_url: `${process.env.BOLETO_SERVICE_URL}/boleto/${invoice.invoice_number}/visualizar`,
    nota_fiscal_url: `${process.env.FISCAL_SERVICE_URL}/nota-fiscal/${invoice.invoice_number}/visualizar`
  }));

  return {
    faturas
  };
};
const visualizarBoleto = async (invoiceNumber) => {
  try {
    const response = await axios.get(`${process.env.BOLETO_SERVICE_URL}/boleto/${invoiceNumber}/visualizar`, {
      responseType: "stream"
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar boleto:", error.message);
    throw new Error("Não foi possível visualizar o boleto");
  }
};


module.exports = {
  getOpenInvoices,
  getLateInvoices,
  getPaidInvoices,
  visualizarBoleto,
};