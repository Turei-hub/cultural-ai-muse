import { getDb } from '../_db.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const db = await getDb()
    const { title, description, price, category, image_url, tags, is_active, is_featured } = req.body

    if (!title || !price || !category) {
      return res.status(400).json({ error: 'title, price, and category are required' })
    }

    const product = {
      title,
      description: description || '',
      price: parseFloat(price),
      category,
      image_url: image_url || '',
      tags: Array.isArray(tags) ? tags : (tags || '').split(',').map(t => t.trim()).filter(Boolean),
      is_active: is_active !== false,
      is_featured: is_featured === true,
      created_at: new Date(),
    }

    const result = await db.collection('products').insertOne(product)
    res.status(201).json({ id: result.insertedId.toString(), ...product })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to create product' })
  }
}
