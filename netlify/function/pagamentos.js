// netlify/functions/pagamentos.js

const { getPaymentStatus, transferToMonero } = require('./mercadopago');
const { calculateMilidex } = require('./milidex');

exports.handler = async (event, context) => {
    const paymentId = event.queryStringParameters.paymentId;
    
    try {
        // 1. Obter o pagamento do Mercado Pago
        const payment = await getPaymentStatus(paymentId);

        if (payment.status !== 'approved') {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Pagamento não aprovado!" })
            };
        }

        // 2. Aplicar a fórmula Milidex ao valor do pagamento
        const valorOriginal = payment.amount;
        const valorMilidex = calculateMilidex(valorOriginal);

        // 3. Transferir para a carteira Monero
        const transferStatus = await transferToMonero(valorMilidex);

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true, transferStatus })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Erro ao processar pagamento!" })
        };
    }
};
