import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Lock, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 400))
    const success = login(username, password)
    if (success) {
      navigate('/admin')
    } else {
      setError('Incorrect username or password.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#0a0a0a]">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="font-serif text-3xl text-[#c9a84c] mb-1">Cultural AI Muse</h1>
          <p className="text-[#9a9080] text-xs tracking-widest uppercase">Admin Portal</p>
        </div>

        {/* Card */}
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-lg p-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 mx-auto mb-6">
            <Lock size={20} className="text-[#c9a84c]" />
          </div>

          <h2 className="font-serif text-2xl text-[#f5f0e8] text-center mb-6">Sign In</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-[#f5f0e8] text-xs tracking-widest uppercase mb-2 block">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="admin"
                required
                autoComplete="username"
                className="w-full bg-[#1e1e1e] border border-[#2a2a2a] text-[#f5f0e8] text-sm px-3 py-3 rounded focus:outline-none focus:border-[#c9a84c] placeholder:text-[#9a9080]/50"
              />
            </div>

            <div>
              <label className="text-[#f5f0e8] text-xs tracking-widest uppercase mb-2 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full bg-[#1e1e1e] border border-[#2a2a2a] text-[#f5f0e8] text-sm px-3 py-3 pr-10 rounded focus:outline-none focus:border-[#c9a84c] placeholder:text-[#9a9080]/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a9080] hover:text-[#f5f0e8]"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#c9a84c] text-[#0a0a0a] py-3 rounded font-semibold text-sm tracking-wider uppercase hover:bg-[#e8c97a] transition-colors disabled:opacity-60 mt-2"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
        </div>

        <p className="text-[#9a9080] text-xs text-center mt-6">
          Cultural AI Muse · Private Admin Access
        </p>
      </div>
    </div>
  )
}
