import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import { api } from '../lib/api'


export default function Footer() {
  return (
    <footer className="border-t border-[#2a2a2a] bg-[#0a0a0a] mt-24">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-2xl text-[#c9a84c] mb-3">Cultural AI Muse</h3>
            <p className="text-[#9a9080] text-sm leading-relaxed max-w-xs">
              AI-generated art celebrating Māori culture, created with aroha and deep respect for our tīpuna and their stories.
            </p>
            <p className="text-[#9a9080] text-xs mt-4">Based in Australia • Māori-owned</p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[#f5f0e8] text-xs tracking-widest uppercase mb-5">Navigate</h4>
            <ul className="space-y-3 text-[#9a9080] text-sm">
              <li><Link to="/" className="hover:text-[#c9a84c] transition-colors">Home</Link></li>
              <li><Link to="/shop" className="hover:text-[#c9a84c] transition-colors">Gallery &amp; Shop</Link></li>
              <li><Link to="/about" className="hover:text-[#c9a84c] transition-colors">About</Link></li>
              <li><Link to="/cart" className="hover:text-[#c9a84c] transition-colors">Cart</Link></li>
            </ul>
          </div>

          {/* Social + Newsletter */}
          <div>
            <h4 className="text-[#f5f0e8] text-xs tracking-widest uppercase mb-5">Connect</h4>
            <a
              href="https://www.tiktok.com/@cultural.ai.muse"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#9a9080] hover:text-[#c9a84c] transition-colors mb-6"
            >
              <ExternalLink size={14} />
              Follow on TikTok
            </a>
            <div className="mt-4">
              <p className="text-[#9a9080] text-xs mb-3">Join the whanau — get new art drops first</p>
              <NewsletterForm />
            </div>
          </div>
        </div>

        <div className="koru-divider mt-12 mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[#9a9080] text-xs">
          <p>© {new Date().getFullYear()} Cultural AI Muse. All rights reserved.</p>
          <p className="text-center">
            Created with aroha and deep respect for Māori culture and tikanga.
          </p>
        </div>

        {/* Admin login link */}
        <div className="text-center mt-6">
          <Link
            to="/admin/login"
            className="text-[#2a2a2a] hover:text-[#9a9080] text-[11px] tracking-widest uppercase transition-colors duration-300"
          >
            Admin
          </Link>
        </div>
      </div>
    </footer>
  )
}

function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      await api.subscribe(email)
      setStatus('done')
      setEmail('')
    } catch {
      setStatus('idle')
    }
  }

  if (status === 'done') {
    return <p className="text-[#c9a84c] text-xs">Kia ora! You're on the list ✨</p>
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="your@email.com"
        className="flex-1 bg-[#1e1e1e] border border-[#2a2a2a] text-[#f5f0e8] text-xs px-3 py-2 rounded focus:outline-none focus:border-[#c9a84c] min-w-0"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-[#c9a84c] text-[#0a0a0a] text-xs px-3 py-2 rounded font-medium hover:bg-[#e8c97a] transition-colors disabled:opacity-50 whitespace-nowrap"
      >
        {status === 'loading' ? '...' : 'Join'}
      </button>
    </form>
  )
}
