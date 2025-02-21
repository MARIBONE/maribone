// netlify/functions/capturar-pagamento.mjs

import fetch from 'node-fetch';

export const handler = async (event, context) => {
    try {
        const mercadoPagoAccessToken = 'APP_USR-3563867331568255-021817-a881bf6d52f6b60d59d79498a7645e0a-2251240952';
        const moneroWalletAddress = '4AR4fUi3QsZfZ3DGAQFbDua9TXQ3NHtAeGt3mh7MYZCk1NsVAjWmiSbLQRffztbXAH1y7ZmT4xyjKdzTwunETUELPDJ7CJz';
        const myMoneroViewKey = '2300a7444b74b6bd8240bdd793fc8a525372dfffbc46676510b1b6d775955806';
        const myMoneroApiUrl = 'https://mymonero.com/api';
        const milidexFormula = (valor) => valor + Math.sqrt(Math.pow(0.00000019, -1));
        const paymentId = event.queryStringParameters.payment_id;

        const mercadoPagoResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${mercadoPagoAccessToken}`,
                'Content-Type': 'application/json',
            },
        });

        const paymentData = await mercadoPagoResponse.json();

        if (!paymentData || paymentData.status !== 'approved') {
            return { statusCode: 400, body: JSON.stringify({ error: 'Pagamento não aprovado!' }) };
        }

        const paymentAmount = parseFloat(paymentData.transaction_amount);
        const convertedAmount = milidexFormula(paymentAmount);
        const moneroTransferPayload = {
            amount: convertedAmount * 1000000000000,
            address: moneroWalletAddress,
            payment_id: 'Pagamento ' + paymentId,
            view_key: myMoneroViewKey,
        };

        const moneroTransferResponse = await fetch(myMoneroApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
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
        return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
    }
};
