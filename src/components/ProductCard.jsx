import { Link } from 'react-router-dom'
import { ShoppingBag, Eye } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function ProductCard({ product }) {
  const { addItem } = useCart()

  function handleQuickAdd(e) {
    e.preventDefault()
    addItem({
      id: product.id,
      title: product.title,
      price: product.price,
      image_url: product.image_url,
      format: 'digital',
    })
  }

  return (
    <Link
      to={`/product/${product.id}`}
      className="art-card group block bg-[#141414] border border-[#2a2a2a] rounded-lg overflow-hidden hover:border-[#c9a84c]/40 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#1e1e1e]">
        <img
          src={product.image_url}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-[#0a0a0a]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
          <button
            onClick={handleQuickAdd}
            className="flex items-center gap-2 bg-[#c9a84c] text-[#0a0a0a] text-xs font-semibold px-4 py-2 rounded hover:bg-[#e8c97a] transition-colors"
          >
            <ShoppingBag size={14} />
            Quick Add
          </button>
          <span className="flex items-center gap-1 text-[#f5f0e8] text-xs">
            <Eye size={14} />
            View
          </span>
        </div>
        {product.is_featured && (
          <div className="absolute top-3 left-3 bg-[#c9a84c] text-[#0a0a0a] text-[10px] font-semibold px-2 py-0.5 rounded tracking-wider uppercase">
            Featured
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-[#9a9080] text-[10px] tracking-widest uppercase mb-1">{product.category}</p>
        <h3 className="font-serif text-[#f5f0e8] text-lg leading-tight mb-2 group-hover:text-[#c9a84c] transition-colors">
          {product.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-[#c9a84c] font-medium text-sm">
            from ${product.price}
          </span>
          <span className="text-[#9a9080] text-xs">Digital + Print</span>
        </div>
      </div>
    </Link>
  )
}
