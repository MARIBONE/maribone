// netlify/functions/pagamentos.js

import fetch from 'node-fetch';

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


document.getElementById('payButton').addEventListener('click', async () => {
    // =======================
    // Configurações Mercado Pago
    // =======================
    const mercadoPagoAccessToken = 'APP_USR-3563867331568255-021817-a881bf6d52f6b60d59d79498a7645e0a-2251240952'; // Seu Access Token do Mercado Pago

    // =======================
    // Dados do pagamento
    // =======================
    const paymentData = {
      items: [
        {
          title: 'Descrição do produto ou serviço', // Título do produto
          quantity: 1,
          currency_id: 'BRL',
          unit_price: 100.00, // Valor do pagamento
        }
      ],
      back_urls: {
        success: 'https://seusite.com/sucesso',
        failure: 'https://seusite.com/falha',
        pending: 'https://seusite.com/pendente'
      },
      auto_return: 'approved'
    };

    try {
      // =======================
      // Requisição à API do Mercado Pago
      // =======================
      const response = await fetch('https://api.mercadopago.com/v1/checkout/preferences', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${mercadoPagoAccessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      const responseData = await response.json();

      // =======================
      // Redirecionamento para o pagamento
      // =======================
      if (responseData.init_point) {
        window.location.href = responseData.init_point;
      } else {
        alert('Erro ao criar o pagamento!');
      }
    } catch (error) {
      console.error('Erro ao criar o pagamento:', error);
      alert('Houve um problema ao processar o pagamento.');
    }
  });

// netlify/functions/pagamentos.js

import fetch from 'node-fetch'; // Usando o fetch para fazer requisições à API do Mercado Pago

exports.handler = async (event, context) => {
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

    const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
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

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
