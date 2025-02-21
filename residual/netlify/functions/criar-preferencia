// netlify/functions/criar-preferencia.mjs

import fetch from 'node-fetch';

export const handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const mercadoPagoAccessToken = 'APP_USR-3563867331568255-021817-a881bf6d52f6b60d59d79498a7645e0a-2251240952';
        const paymentData = {
            items: [
                {
                    title: 'Descrição do produto ou serviço',
                    quantity: 1,
                    currency_id: 'BRL',
                    unit_price: 100.00,
                }
            ],
            back_urls: {
                success: 'https://seusite.com/sucesso',
                failure: 'https://seusite.com/falha',
                pending: 'https://seusite.com/pendente'
            },
            auto_return: 'approved'
        };

        const response = await fetch('https://api.mercadopago.com/v1/checkout/preferences', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${mercadoPagoAccessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
        });

        const responseData = await response.json();

        if (responseData.id) {
            return {
                statusCode: 200,
                body: JSON.stringify({ preferenceId: responseData.id })
            };
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: 'Falha ao criar a preferência de pagamento!' })
            };
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
