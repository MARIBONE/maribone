// functions/mercadopago.js
const MercadoPago = require('mercado-pago');

// Configurar o Access Token do Mercado Pago (substitua pelo seu token)
MercadoPago.configurations.setAccessToken('APP_USR-3563867331568255-021817-a881bf6d52f6b60d59d79498a7645e0a-2251240952'); // Insira seu token de acesso

exports.handler = async function(event, context) {
  try {
    // Criando a preferência de pagamento
    const preference = {
      items: [
        {
          title: "Produto Teste",
          quantity: 1,
          unit_price: 100
        }
      ]
    };

    const preferenceResponse = await MercadoPago.preferences.create(preference);

    // Retorna o ID da preferência para o frontend
    return {
      statusCode: 200,
      body: JSON.stringify({
        preferenceId: preferenceResponse.body.id
      })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Erro ao criar a preferência', error: error.message })
    };
  }
};
