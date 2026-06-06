import { getDb } from './_db.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') return res.status(200).end()

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const db = await getDb()
    const orders = await db
      .collection('orders')
      .find({})
      .sort({ created_at: -1 })
      .limit(100)
      .toArray()

    const serialized = orders.map(o => ({ ...o, id: o._id.toString(), _id: undefined }))
    res.status(200).json(serialized)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch orders' })
  }
}
