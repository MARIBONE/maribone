const express = require('express');
const mercadopago = require('mercadopago');

mercadopago.configure({
  access_token: 'APP_USR-3563867331568255-021817-a881bf6d52f6b60d59d79498a7645e0a-2251240952'
});

const app = express();
app.use(express.json());

app.post('/create_preference', async (req, res) => {
  const { title, quantity, price } = req.body;

  const preference = {
    items: [
      {
        title,
        quantity,
        currency_id: 'BRL',
        unit_price: price
      }
    ]
  };

  try {
    const response = await mercadopago.preferences.create(preference);
    res.json({ id: response.body.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
