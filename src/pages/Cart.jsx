import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Trash2, ArrowRight, ShoppingBag, Loader } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { api } from '../lib/api'

export default function Cart() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart()
  const [checkingOut, setCheckingOut] = useState(false)
  const [error, setError] = useState('')

  async function handleCheckout() {
    setCheckingOut(true)
    setError('')
    try {
      const { url } = await api.createCheckoutSession(items)
      window.location.href = url
    } catch (err) {
      setError('Checkout unavailable — ensure Stripe keys are configured.')
      setCheckingOut(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="pt-24 min-h-screen flex flex-col items-center justify-center text-center px-6">
        <ShoppingBag size={48} className="text-[#2a2a2a] mb-6" />
        <h1 className="font-serif text-4xl text-[#f5f0e8] mb-3">Your cart is empty</h1>
        <p className="text-[#9a9080] text-sm mb-8">Discover art that speaks to your wairua</p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#0a0a0a] px-8 py-4 rounded font-semibold text-sm hover:bg-[#e8c97a] transition-colors"
        >
          Browse Gallery
          <ArrowRight size={16} />
        </Link>
      </div>
    )
  }

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-12">
          <h1 className="font-serif text-4xl text-[#f5f0e8]">Your Cart</h1>
          <button
            onClick={clearCart}
            className="text-[#9a9080] text-xs hover:text-red-400 transition-colors"
          >
            Clear all
          </button>
        </div>

        <div className="space-y-4 mb-10">
          {items.map(item => (
            <div
              key={`${item.id}-${item.format}`}
              className="flex gap-4 p-4 bg-[#141414] border border-[#2a2a2a] rounded-lg"
            >
              <img
                src={item.image_url}
                alt={item.title}
                className="w-20 h-20 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <Link
                  to={`/product/${item.id}`}
                  className="font-serif text-lg text-[#f5f0e8] hover:text-[#c9a84c] transition-colors line-clamp-1"
                >
                  {item.title}
                </Link>
                <p className="text-[#9a9080] text-xs mt-0.5 mb-3">
                  {item.formatLabel || item.format}
                </p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 bg-[#1e1e1e] border border-[#2a2a2a] rounded">
                    <button
                      onClick={() => updateQuantity(item.id, item.format, item.quantity - 1)}
                      className="w-7 h-7 text-[#9a9080] hover:text-[#f5f0e8] transition-colors flex items-center justify-center"
                    >
                      −
                    </button>
                    <span className="text-[#f5f0e8] text-sm w-5 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.format, item.quantity + 1)}
                      className="w-7 h-7 text-[#9a9080] hover:text-[#f5f0e8] transition-colors flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-[#c9a84c] font-medium text-sm">
                    ${item.price * item.quantity}
                  </span>
                </div>
              </div>
              <button
                onClick={() => removeItem(item.id, item.format)}
                className="text-[#2a2a2a] hover:text-red-400 transition-colors self-start mt-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-lg p-6">
          <h2 className="font-serif text-xl text-[#f5f0e8] mb-6">Order Summary</h2>
          <div className="space-y-3 mb-6 text-sm">
            <div className="flex justify-between text-[#9a9080]">
              <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span>${total}</span>
            </div>
            <div className="flex justify-between text-[#9a9080]">
              <span>GST (included)</span>
              <span>${Math.round(total / 11)}</span>
            </div>
            <div className="border-t border-[#2a2a2a] pt-3 flex justify-between">
              <span className="text-[#f5f0e8] font-medium">Total</span>
              <span className="text-[#c9a84c] font-serif text-xl">${total} AUD</span>
            </div>
          </div>

          {error && <p className="text-red-400 text-xs mb-3 text-center">{error}</p>}

          <button
            onClick={handleCheckout}
            disabled={checkingOut}
            className="w-full flex items-center justify-center gap-2 bg-[#c9a84c] text-[#0a0a0a] py-4 rounded font-semibold tracking-wider uppercase text-sm hover:bg-[#e8c97a] transition-colors disabled:opacity-60"
          >
            {checkingOut ? <><Loader size={16} className="animate-spin" /> Processing…</> : <>Proceed to Checkout <ArrowRight size={16} /></>}
          </button>

          <p className="text-[#9a9080] text-xs text-center mt-4">
            Secure checkout via Stripe · Digital downloads delivered immediately
          </p>
        </div>
      </div>
    </div>
  )
}
