import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_KEY = Deno.env.get('SERVICE_ROLE_KEY')
const FROM = 'Cultural AI Muse <onboarding@resend.dev>'

serve(async (req) => {
  try {
    const { subject, html } = await req.json()
    if (!subject || !html) return new Response('Missing subject or html', { status: 400 })

    // Get all subscribers
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!)
    const { data: subscribers, error } = await supabase
      .from('newsletter_subscribers')
      .select('email')

    if (error) throw error

    const emails = subscribers.map((s: { email: string }) => s.email)

    // Send to all via Resend batch
    const res = await fetch('https://api.resend.com/emails/batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify(
        emails.map((to: string) => ({
          from: FROM,
          to,
          subject,
          html,
        }))
      ),
    })

    const data = await res.json()
    return new Response(JSON.stringify({ sent: emails.length, data }), {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
})
