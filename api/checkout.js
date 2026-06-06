import Stripe from 'stripe'
import { getDb } from './_db.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', process.env.VITE_APP_URL || '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  const { items, customerEmail } = req.body

  if (!items?.length) return res.status(400).json({ error: 'No items in cart' })

  try {
    const lineItems = items.map(item => ({
      price_data: {
        currency: 'aud',
        product_data: {
          name: `${item.title} — ${item.formatLabel || item.format}`,
          images: item.image_url ? [item.image_url] : [],
        },
        unit_amount: Math.round(item.price * 100), // cents
      },
      quantity: item.quantity,
    }))

    const appUrl = process.env.VITE_APP_URL || 'http://localhost:5173'

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: customerEmail,
      line_items: lineItems,
      mode: 'payment',
      success_url: `${appUrl}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cart`,
      metadata: {
        items: JSON.stringify(items.map(i => ({ id: i.id, format: i.format, quantity: i.quantity, price: i.price }))),
      },
    })

    res.status(200).json({ url: session.url })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create checkout session' })
  }
}
