import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, ShoppingBag, Download, Printer, Check } from 'lucide-react'

const SITE_URL = 'https://culturalaimuse.com'
import { useCart } from '../context/CartContext'
import { PLACEHOLDER_PRODUCTS } from '../data/placeholderProducts'
import ProductCard from '../components/ProductCard'

const FORMAT_OPTIONS = [
  {
    id: 'digital',
    label: 'Digital Download',
    icon: Download,
    description: 'High-resolution JPG + PNG, 300dpi. Instant delivery via email.',
    priceMultiplier: 1,
  },
  {
    id: 'print-a4',
    label: 'A4 Print',
    icon: Printer,
    description: 'Archival giclée print on 250gsm fine art paper. Ships from Australia.',
    priceMultiplier: 2.5,
  },
  {
    id: 'print-a3',
    label: 'A3 Print',
    icon: Printer,
    description: 'Large format archival giclée print. Makes a stunning statement piece.',
    priceMultiplier: 4,
  },
]

export default function ProductDetail() {
  const { id } = useParams()
  const product = PLACEHOLDER_PRODUCTS.find(p => p.id === id)
  const { addItem } = useCart()
  const [selectedFormat, setSelectedFormat] = useState('digital')
  const [added, setAdded] = useState(false)

  if (!product) {
    return (
      <div className="pt-32 min-h-screen flex flex-col items-center justify-center text-center px-6">
        <p className="font-serif text-3xl text-[#f5f0e8]/40 mb-4">Work not found</p>
        <Link to="/shop" className="text-[#c9a84c] text-sm hover:underline">← Back to gallery</Link>
      </div>
    )
  }

  const format = FORMAT_OPTIONS.find(f => f.id === selectedFormat)
  const price = Math.round(product.price * format.priceMultiplier)

  function handleAddToCart() {
    addItem({
      id: product.id,
      title: product.title,
      price,
      image_url: product.image_url,
      format: selectedFormat,
      formatLabel: format.label,
    })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const related = PLACEHOLDER_PRODUCTS
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 3)

  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.image_url,
    url: `${SITE_URL}/product/${product.id}`,
    brand: { '@type': 'Brand', name: 'Cultural AI Muse' },
    category: product.category,
    keywords: product.tags.join(', '),
    offers: FORMAT_OPTIONS.map(opt => ({
      '@type': 'Offer',
      name: opt.label,
      price: Math.round(product.price * opt.priceMultiplier).toString(),
      priceCurrency: 'AUD',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/product/${product.id}`,
    })),
  }

  return (
    <div className="pt-24 min-h-screen">
      <Helmet>
        <title>{product.title} — Cultural AI Muse</title>
        <meta name="description" content={`${product.description} Available as a digital download or archival print from Cultural AI Muse.`} />
        <link rel="canonical" href={`${SITE_URL}/product/${product.id}`} />
        <meta property="og:type" content="og:product" />
        <meta property="og:url" content={`${SITE_URL}/product/${product.id}`} />
        <meta property="og:title" content={`${product.title} — Cultural AI Muse`} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.image_url} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${product.title} — Cultural AI Muse`} />
        <meta name="twitter:description" content={product.description} />
        <meta name="twitter:image" content={product.image_url} />
        <script type="application/ld+json">{JSON.stringify(productLd)}</script>
      </Helmet>
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Back */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-[#9a9080] text-sm hover:text-[#c9a84c] transition-colors mb-10"
        >
          <ArrowLeft size={14} />
          Back to Gallery
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          {/* Image */}
          <div className="relative">
            <div className="aspect-[4/5] rounded-lg overflow-hidden bg-[#141414] border border-[#2a2a2a]">
              <img
                src={product.image_url}
                alt={product.title}
                className="w-full h-full object-cover img-fade"
              />
            </div>
            {/* Gold corner accent */}
            <div className="absolute -top-2 -left-2 w-8 h-8 border-t border-l border-[#c9a84c]/50" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b border-r border-[#c9a84c]/50" />
          </div>

          {/* Details */}
          <div className="flex flex-col justify-start">
            <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-3">{product.category}</p>
            <h1 className="font-serif text-4xl md:text-5xl text-[#f5f0e8] leading-tight mb-6">
              {product.title}
            </h1>
            <p className="text-[#9a9080] leading-relaxed mb-8 text-sm">
              {product.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {product.tags.map(tag => (
                <span
                  key={tag}
                  className="text-[10px] tracking-wider uppercase text-[#9a9080] border border-[#2a2a2a] px-2 py-1 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Format selection */}
            <div className="mb-8">
              <p className="text-[#f5f0e8] text-xs tracking-widest uppercase mb-4">Format & Size</p>
              <div className="space-y-3">
                {FORMAT_OPTIONS.map(opt => {
                  const Icon = opt.icon
                  const optPrice = Math.round(product.price * opt.priceMultiplier)
                  return (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedFormat(opt.id)}
                      className={`w-full flex items-start gap-4 p-4 rounded-lg border text-left transition-all duration-200 ${
                        selectedFormat === opt.id
                          ? 'border-[#c9a84c] bg-[#c9a84c]/5'
                          : 'border-[#2a2a2a] bg-[#141414] hover:border-[#c9a84c]/40'
                      }`}
                    >
                      <Icon size={18} className={selectedFormat === opt.id ? 'text-[#c9a84c]' : 'text-[#9a9080]'} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-sm font-medium ${selectedFormat === opt.id ? 'text-[#c9a84c]' : 'text-[#f5f0e8]'}`}>
                            {opt.label}
                          </span>
                          <span className="text-[#c9a84c] font-medium text-sm">${optPrice}</span>
                        </div>
                        <p className="text-[#9a9080] text-xs mt-1 leading-relaxed">{opt.description}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Price + Add to cart */}
            <div className="flex items-center gap-4 mb-6">
              <span className="font-serif text-3xl text-[#c9a84c]">${price}</span>
              <span className="text-[#9a9080] text-xs">AUD · Incl. GST</span>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex items-center justify-center gap-3 w-full py-4 rounded font-semibold tracking-wider uppercase text-sm transition-all duration-200 ${
                added
                  ? 'bg-green-800/30 border border-green-600/40 text-green-400'
                  : 'bg-[#c9a84c] text-[#0a0a0a] hover:bg-[#e8c97a]'
              }`}
            >
              {added ? (
                <><Check size={16} /> Added to Cart</>
              ) : (
                <><ShoppingBag size={16} /> Add to Cart</>
              )}
            </button>

            <p className="text-[#9a9080] text-xs text-center mt-4">
              Secure checkout via Stripe · Digital downloads delivered instantly
            </p>
          </div>
        </div>

        {/* Related works */}
        {related.length > 0 && (
          <section>
            <div className="koru-divider mb-12">
              <span className="text-[#9a9080] text-xs tracking-[0.3em] uppercase whitespace-nowrap px-4">
                More in {product.category}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
