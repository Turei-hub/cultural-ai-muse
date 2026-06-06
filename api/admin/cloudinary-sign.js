import crypto from 'crypto'

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { folder = 'cultural-ai-muse', public_id } = req.body
  const timestamp = Math.round(Date.now() / 1000)
  const apiSecret = process.env.CLOUDINARY_API_SECRET
  const apiKey = process.env.CLOUDINARY_API_KEY

  if (!apiSecret || !apiKey) {
    return res.status(500).json({ error: 'Cloudinary credentials not configured' })
  }

  // Build params to sign
  const params = { folder, timestamp }
  if (public_id) params.public_id = public_id

  const sortedParams = Object.keys(params)
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join('&')

  const signature = crypto
    .createHash('sha256')
    .update(sortedParams + apiSecret)
    .digest('hex')

  res.status(200).json({
    signature,
    timestamp,
    api_key: apiKey,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || process.env.VITE_CLOUDINARY_CLOUD_NAME,
    folder,
  })
}
