import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ShoppingBag, Menu, X, LayoutDashboard } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { itemCount } = useCart()
  const { isAuthenticated } = useAuth()
  const [open, setOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `text-sm tracking-widest uppercase transition-colors duration-200 ${
      isActive ? 'text-[#c9a84c]' : 'text-[#f5f0e8]/70 hover:text-[#c9a84c]'
    }`

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0a]/90 backdrop-blur-md border-b border-[#2a2a2a]">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex flex-col items-start">
          <span className="font-serif text-xl text-[#c9a84c] tracking-wide leading-none">
            Cultural AI Muse
          </span>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#9a9080] mt-0.5">
            Māori Art &amp; Digital Creations
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/shop" className={linkClass}>Shop</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
        </div>

        {/* Cart + admin + mobile toggle */}
        <div className="flex items-center gap-4">
          {isAuthenticated && (
            <Link
              to="/admin"
              className="hidden md:flex items-center gap-1.5 text-xs tracking-widest uppercase text-[#c9a84c] border border-[#c9a84c]/30 px-3 py-1.5 rounded hover:bg-[#c9a84c]/10 transition-colors"
            >
              <LayoutDashboard size={13} />
              Admin
            </Link>
          )}
          <Link to="/cart" className="relative p-2 text-[#f5f0e8]/70 hover:text-[#c9a84c] transition-colors">
            <ShoppingBag size={20} />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#c9a84c] text-[#0a0a0a] text-[10px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
          <button
            className="md:hidden p-2 text-[#f5f0e8]/70 hover:text-[#c9a84c] transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-[#141414] border-t border-[#2a2a2a] px-6 py-6 flex flex-col gap-6">
          <NavLink to="/" end className={linkClass} onClick={() => setOpen(false)}>Home</NavLink>
          <NavLink to="/shop" className={linkClass} onClick={() => setOpen(false)}>Shop</NavLink>
          <NavLink to="/about" className={linkClass} onClick={() => setOpen(false)}>About</NavLink>
          {isAuthenticated && (
            <NavLink to="/admin" className={linkClass} onClick={() => setOpen(false)}>Admin Dashboard</NavLink>
          )}
        </div>
      )}
    </nav>
  )
}
