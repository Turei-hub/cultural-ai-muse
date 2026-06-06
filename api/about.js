import { getDb } from './_db.js'

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  try {
    const db = await getDb()

    if (req.method === 'GET') {
      const doc = await db.collection('site_content').findOne({ key: 'about' })
      res.status(200).json(doc?.content || defaultAbout)

    } else if (req.method === 'PUT') {
      await db.collection('site_content').updateOne(
        { key: 'about' },
        { $set: { key: 'about', content: req.body, updated_at: new Date() } },
        { upsert: true }
      )
      res.status(200).json({ success: true })

    } else {
      res.status(405).json({ error: 'Method not allowed' })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
}

const defaultAbout = {
  creator_name: 'Turei',
  story: 'Ko tōku tīpuna i heke mai i Aotearoa. My ancestors came from the land of the long white cloud, and though I now call Australia home, Aotearoa lives in my heart and in every piece I create.',
  tiktok_handle: '@culturalaimuse',
  tiktok_url: 'https://www.tiktok.com/@culturalaimuse',
  kaupapa: 'Every piece is created with deep respect for Māori culture, tikanga, and the stories of our tīpuna. Art as a bridge between worlds — digital and ancestral.',
}
