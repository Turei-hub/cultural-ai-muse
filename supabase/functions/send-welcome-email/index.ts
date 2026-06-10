import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const FROM = 'Cultural AI Muse <onboarding@resend.dev>'

serve(async (req) => {
  try {
    const { record } = await req.json()
    const email = record?.email
    if (!email) return new Response('No email', { status: 400 })

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM,
        to: email,
        subject: 'Kia ora — Welcome to Cultural AI Muse 🌿',
        html: `
          <div style="background:#0a0a0a;color:#f5f0e8;font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 32px;">
            <h1 style="color:#c9a84c;font-size:32px;margin-bottom:8px;">Cultural AI Muse</h1>
            <p style="color:#9a9080;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:32px;">Māori Art & Digital Creations</p>

            <h2 style="font-size:24px;margin-bottom:16px;">Kia ora, welcome to the whānau! 🌿</h2>
            <p style="color:#9a9080;line-height:1.7;margin-bottom:24px;">
              Thank you for joining the Cultural AI Muse community. You'll be the first to hear about new art drops,
              seasonal collections, and exclusive pieces celebrating Māori culture.
            </p>

            <div style="border-top:1px solid #2a2a2a;border-bottom:1px solid #2a2a2a;padding:24px 0;margin:32px 0;text-align:center;">
              <p style="color:#c9a84c;font-style:italic;font-size:18px;margin:0;">
                "He aha te mea nui o te ao?<br/>He tangata, he tangata, he tangata."
              </p>
              <p style="color:#9a9080;font-size:12px;margin-top:12px;">
                What is the greatest thing in the world? It is people.
              </p>
            </div>

            <a href="https://cultural-ai-muse.vercel.app/shop"
               style="display:inline-block;background:#c9a84c;color:#0a0a0a;padding:14px 32px;text-decoration:none;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;font-size:12px;border-radius:4px;margin-bottom:32px;">
              Explore the Gallery
            </a>

            <p style="color:#9a9080;font-size:11px;margin-top:32px;border-top:1px solid #2a2a2a;padding-top:16px;">
              © 2026 Cultural AI Muse · Based in Australia · Māori-owned<br/>
              You're receiving this because you subscribed at cultural-ai-muse.vercel.app
            </p>
          </div>
        `,
      }),
    })

    const data = await res.json()
    return new Response(JSON.stringify(data), { status: res.status, headers: { 'Content-Type': 'application/json' } })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
