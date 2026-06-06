import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Search } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { PLACEHOLDER_PRODUCTS, CATEGORIES } from '../data/placeholderProducts'

const SITE_URL = 'https://culturalaimuse.com'

export default function Shop() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('featured')

  const filtered = PLACEHOLDER_PRODUCTS
    .filter(p => p.is_active)
    .filter(p => activeCategory === 'All' || p.category === activeCategory)
    .filter(p =>
      search === '' ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))
    )
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price
      if (sort === 'price-desc') return b.price - a.price
      if (sort === 'featured') return (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0)
      return 0
    })

  return (
    <div className="pt-24 min-h-screen">
      <Helmet>
        <title>The Collection — Māori AI Art Gallery | Cultural AI Muse</title>
        <meta name="description" content="Browse the full gallery of AI-generated Māori art. Portraits of atua, Aotearoa landscapes, whakataukī quotes, and wahine artworks. Available as digital downloads or archival prints." />
        <link rel="canonical" href={`${SITE_URL}/shop`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${SITE_URL}/shop`} />
        <meta property="og:title" content="The Collection — Māori AI Art Gallery | Cultural AI Muse" />
        <meta property="og:description" content="Browse AI-generated Māori art — portraits, landscapes, whakataukī, and wahine works. Digital downloads & archival prints." />
        <meta property="og:image" content={`${SITE_URL}/og-shop.jpg`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="The Collection — Māori AI Art Gallery | Cultural AI Muse" />
        <meta name="twitter:description" content="Browse AI-generated Māori art. Digital downloads & archival prints." />
        <meta name="twitter:image" content={`${SITE_URL}/og-shop.jpg`} />
      </Helmet>
      {/* Header */}
      <section className="py-16 px-6 text-center border-b border-[#2a2a2a]">
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">Gallery</p>
        <h1 className="font-serif text-5xl md:text-6xl text-[#f5f0e8] mb-4">The Collection</h1>
        <p className="text-[#9a9080] text-sm max-w-md mx-auto">
          Each piece is a digital original — available as a digital download or archival print.
        </p>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-10">
          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs tracking-widest uppercase transition-all duration-200 ${
                  activeCategory === cat
                    ? 'bg-[#c9a84c] text-[#0a0a0a] font-semibold'
                    : 'bg-[#1e1e1e] border border-[#2a2a2a] text-[#9a9080] hover:border-[#c9a84c]/40 hover:text-[#c9a84c]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search + Sort */}
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a9080]" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search art..."
                className="w-full md:w-48 bg-[#1e1e1e] border border-[#2a2a2a] text-[#f5f0e8] text-xs pl-9 pr-3 py-2 rounded focus:outline-none focus:border-[#c9a84c]"
              />
            </div>
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="bg-[#1e1e1e] border border-[#2a2a2a] text-[#9a9080] text-xs px-3 py-2 rounded focus:outline-none focus:border-[#c9a84c]"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low–High</option>
              <option value="price-desc">Price: High–Low</option>
            </select>
          </div>
        </div>

        {/* Results count */}
        <p className="text-[#9a9080] text-xs mb-8">
          {filtered.length} work{filtered.length !== 1 ? 's' : ''}{activeCategory !== 'All' ? ` in ${activeCategory}` : ''}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className="font-serif text-2xl text-[#f5f0e8]/40 mb-3">No works found</p>
            <p className="text-[#9a9080] text-sm">Try a different category or search term</p>
          </div>
        )}
      </div>
    </div>
  )
}
