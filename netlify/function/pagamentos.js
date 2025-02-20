// netlify/functions/pagamentos.js

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
  try {
    // =======================
    // Configurações Mercado Pago
    // =======================
    const mercadoPagoAccessToken = 'APP_USR-3563867331568255-021817-a881bf6d52f6b60d59d79498a7645e0a-2251240952'; // Preencha com o Access Token do Mercado Pago
    const mercadoPagoPublicKey = 'APP_USR-d483c572-9b7d-49ef-94d9-391f073968b0';     // Preencha com a Public Key do Mercado Pago

    // =======================
    // Configurações MyMonero
    // =======================
    const moneroWalletAddress = '4AR4fUi3QsZfZ3DGAQFbDua9TXQ3NHtAeGt3mh7MYZCk1NsVAjWmiSbLQRffztbXAH1y7ZmT4xyjKdzTwunETUELPDJ7CJz'; // Preencha com o endereço da carteira Monero
    const myMoneroViewKey = '2300a7444b74b6bd8240bdd793fc8a525372dfffbc46676510b1b6d775955806'; // Preencha com a sua View Key da carteira Monero
    const myMoneroApiUrl = 'https://mymonero.com/api'; // Endpoint da API MyMonero

    // =======================
    // Fórmula Milidex
    // =======================
    const milidexFormula = (valor) => valor + Math.sqrt(Math.pow(0.00000019, -1));

    // =======================
    // Capturar o pagamento do Mercado Pago
    // =======================
    const paymentId = event.queryStringParameters.payment_id; // O ID do pagamento vindo do webhook

    const mercadoPagoResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${mercadoPagoAccessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const paymentData = await mercadoPagoResponse.json();

    if (!paymentData || paymentData.status !== 'approved') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Pagamento não aprovado!' }),
      };
    }

    const paymentAmount = parseFloat(paymentData.transaction_amount);

    // =======================
    // Aplicando a fórmula Milidex
    // =======================
    const convertedAmount = milidexFormula(paymentAmount);

    // =======================
    // Transferência para a carteira Monero via MyMonero API
    // =======================
    const moneroTransferPayload = {
      amount: convertedAmount * 1000000000000, // Converter para picoMonero
      address: moneroWalletAddress, // Endereço da sua carteira Monero
      payment_id: 'Pagamento ' + paymentId, // Referência ao pagamento
      view_key: myMoneroViewKey, // Sua view key
    };

    // Envio da transação via API do MyMonero
    const moneroTransferResponse = await fetch(myMoneroApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(moneroTransferPayload),
    });

    const moneroTransferData = await moneroTransferResponse.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Pagamento processado com sucesso!',
        mercadoPago: paymentData,
        valorConvertido: convertedAmount,
        moneroTransferStatus: moneroTransferData,
      }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
