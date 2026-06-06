import { getDb } from './_db.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const db = await getDb()
    const { category, featured, search } = req.query

    const filter = { is_active: true }
    if (category && category !== 'All') filter.category = category
    if (featured === 'true') filter.is_featured = true
    if (search) filter.$text = { $search: search }

    const products = await db
      .collection('products')
      .find(filter)
      .sort({ is_featured: -1, created_at: -1 })
      .toArray()

    // Serialize _id to string
    const serialized = products.map(p => ({ ...p, id: p._id.toString(), _id: undefined }))
    res.status(200).json(serialized)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
}
