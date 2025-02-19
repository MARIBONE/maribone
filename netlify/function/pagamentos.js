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
    // Configurações Monero
    // =======================

    const moneroWalletAddress = '4AR4fUi3QsZfZ3DGAQFbDua9TXQ3NHtAeGt3mh7MYZCk1NsVAjWmiSbLQRffztbXAH1y7ZmT4xyjKdzTwunETUELPDJ7CJz'; // Preencha com o endereço da carteira Monero

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
    // Transferência para a carteira Monero
    // =======================

    const moneroTransferPayload = {
      destinations: [
        {
          address: moneroWalletAddress,
          amount: convertedAmount,
        },
      ],
    };

    // Este é um exemplo, precisa ser conectado a uma API de gateway Monero
    const moneroResponse = await fetch('URL_DA_API_MONERO_AQUI', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(moneroTransferPayload),
    });

    const moneroData = await moneroResponse.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Pagamento processado com sucesso!',
        mercadoPago: paymentData,
        moneroTransaction: moneroData,
        valorConvertido: convertedAmount,
      }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
