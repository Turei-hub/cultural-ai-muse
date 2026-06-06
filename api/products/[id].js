import { getDb } from '../_db.js'
import { ObjectId } from 'mongodb'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { id } = req.query

  try {
    const db = await getDb()

    if (req.method === 'GET') {
      const product = await db.collection('products').findOne({ _id: new ObjectId(id) })
      if (!product) return res.status(404).json({ error: 'Product not found' })
      res.status(200).json({ ...product, id: product._id.toString(), _id: undefined })

    } else if (req.method === 'PATCH') {
      const update = req.body
      delete update._id
      delete update.id
      await db.collection('products').updateOne(
        { _id: new ObjectId(id) },
        { $set: { ...update, updated_at: new Date() } }
      )
      res.status(200).json({ success: true })

    } else if (req.method === 'DELETE') {
      await db.collection('products').deleteOne({ _id: new ObjectId(id) })
      res.status(200).json({ success: true })

    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}
