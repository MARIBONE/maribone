// netlify/functions/pagamentos.mjs
 
import fetch from 'node-fetch'; // Usando o fetch para fazer requisições à API do Mercado Pago

export const handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }
  try {
    // =======================
    // Configurações Mercado Pago
    // =======================
    const mercadoPagoAccessToken = 'APP_USR-3563867331568255-021817-a881bf6d52f6b60d59d79498a7645e0a-2251240952'; // Substitua pelo seu Access Token do Mercado Pago

    // =======================
    // Criando a preferência de pagamento
    // =======================
    const paymentData = {
      items: [
        {
          title: "Produto Exemplo", // Substitua pelo nome do produto
          quantity: 1, // Quantidade de itens
          unit_price: 100, // Preço do produto
        },
      ],
    };

    const response = await fetch('https://api.mercadopago.com/v1/checkout/preferences', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${mercadoPagoAccessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(paymentData), // Dados do pagamento
    });

    const preference = await response.json();

    if (!preference.id) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Falha ao criar a preferência de pagamento!' }),
      };
    }

    // =======================
    // Retornando o ID da preferência
    // =======================
    return {
      statusCode: 200,
      body: JSON.stringify({ preferenceId: preference.id }),
    };

  }
