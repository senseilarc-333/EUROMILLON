import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

app.post('/create-checkout-session', async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    // Transformar los items del carrito al formato de Stripe
    const lineItems = items.map(item => {
      return {
        price_data: {
          currency: 'mxn', // ¡AQUI FORZAMOS PESOS MEXICANOS!
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100, // Stripe espera el monto en centavos
        },
        quantity: 1,
      };
    });

    // Crear la sesión de checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${req.headers.origin}/success.html`,
      cancel_url: `${req.headers.origin}/cancel.html`,
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Error al crear sesión de Stripe:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor de pagos corriendo en http://localhost:${PORT}`);
});
