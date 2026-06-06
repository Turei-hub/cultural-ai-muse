import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { ArrowRight, ExternalLink, Users, Heart, Eye } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { PLACEHOLDER_PRODUCTS } from '../data/placeholderProducts'

const FEATURED = PLACEHOLDER_PRODUCTS.filter(p => p.is_featured).slice(0, 3)

const SITE_URL = 'https://culturalaimuse.com'

const homeLd = {
  '@context': 'https://schema.org',
  '@type': 'Store',
  name: 'Cultural AI Muse',
  description: 'AI-generated imagery celebrating Māori culture — portraits, landscapes, whakataukī, and seasonal art by a Māori creator based in Australia.',
  url: SITE_URL,
  image: `${SITE_URL}/og-home.jpg`,
  currenciesAccepted: 'AUD',
  paymentAccepted: 'Credit Card',
  areaServed: ['AU', 'NZ'],
}

export default function Home() {
  return (
    <div>
      <Helmet>
        <title>Cultural AI Muse — Māori Art & Digital Creations</title>
        <meta name="description" content="AI-generated imagery celebrating Māori culture. Portraits, landscapes, whakataukī quotes, and seasonal art by a Māori creator based in Australia. Digital downloads & archival prints." />
        <link rel="canonical" href={SITE_URL} />
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:title" content="Cultural AI Muse — Māori Art & Digital Creations" />
        <meta property="og:description" content="AI-generated imagery celebrating Māori culture. Digital downloads & archival prints by a Māori creator based in Australia." />
        <meta property="og:image" content={`${SITE_URL}/og-home.jpg`} />
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Cultural AI Muse — Māori Art & Digital Creations" />
        <meta name="twitter:description" content="AI-generated imagery celebrating Māori culture. Digital downloads & archival prints." />
        <meta name="twitter:image" content={`${SITE_URL}/og-home.jpg`} />
        <script type="application/ld+json">{JSON.stringify(homeLd)}</script>
      </Helmet>
      <Hero />
      <FeaturedSection />
      <KaupapaBanner />
      <SocialProof />
    </div>
  )
}

export { SITE_URL }

function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background mosaic */}
      <div className="absolute inset-0 grid grid-cols-3 opacity-25">
        {PLACEHOLDER_PRODUCTS.slice(0, 6).map((p, i) => (
          <div key={p.id} className="relative overflow-hidden">
            <img
              src={p.image_url}
              alt=""
              className="w-full h-full object-cover"
              style={{ filter: 'brightness(0.4) saturate(0.6)' }}
            />
          </div>
        ))}
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-[#0a0a0a]/50 to-[#0a0a0a]" />

      {/* Gold decorative line top */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#c9a84c] to-transparent opacity-60" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <p className="text-[#c9a84c] text-xs tracking-[0.35em] uppercase mb-6 slide-up">
          Māori Art &amp; Digital Creations
        </p>
        <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#f5f0e8] leading-[1.05] mb-6 slide-up" style={{ animationDelay: '0.1s' }}>
          Where Culture
          <br />
          <span className="text-[#c9a84c] italic">Meets Creation</span>
        </h1>
        <p className="text-[#9a9080] text-lg max-w-xl mx-auto leading-relaxed mb-10 slide-up" style={{ animationDelay: '0.2s' }}>
          AI-generated imagery celebrating Māori culture, atua, and the whenua.
          Art that honours the past and imagines the future.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center slide-up" style={{ animationDelay: '0.3s' }}>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#c9a84c] text-[#0a0a0a] px-8 py-4 rounded font-semibold tracking-wider uppercase text-sm hover:bg-[#e8c97a] transition-colors"
          >
            Explore the Gallery
            <ArrowRight size={16} />
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 border border-[#c9a84c]/40 text-[#f5f0e8] px-8 py-4 rounded font-medium tracking-wider uppercase text-sm hover:border-[#c9a84c] hover:text-[#c9a84c] transition-colors"
          >
            Our Story
          </Link>
        </div>
      </div>

      {/* Scroll hint */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-16 bg-gradient-to-b from-[#c9a84c]/60 to-transparent" />
        <p className="text-[#9a9080] text-[10px] tracking-widest uppercase">Scroll</p>
      </div>
    </section>
  )
}

function FeaturedSection() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">Kia ora</p>
        <h2 className="font-serif text-4xl md:text-5xl text-[#f5f0e8] mb-4">Featured Works</h2>
        <div className="koru-divider max-w-xs mx-auto" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURED.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-[#c9a84c] text-sm tracking-widest uppercase hover:gap-3 transition-all duration-200"
        >
          View All Works
          <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  )
}

function KaupapaBanner() {
  return (
    <section className="py-24 px-6 bg-[#141414] border-y border-[#2a2a2a]">
      <div className="max-w-3xl mx-auto text-center">
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-8">Our Kaupapa</p>
        <blockquote className="font-serif text-3xl md:text-4xl text-[#f5f0e8] italic leading-relaxed mb-8">
          "He aha te mea nui o te ao?
          <br />
          He tangata, he tangata, he tangata."
        </blockquote>
        <p className="text-[#9a9080] text-sm mb-2">
          What is the greatest thing in the world?
        </p>
        <p className="text-[#f5f0e8]/70 text-sm italic">
          It is people. It is people. It is people.
        </p>
        <div className="koru-divider max-w-sm mx-auto mt-10 mb-10" />
        <p className="text-[#9a9080] text-sm leading-relaxed max-w-lg mx-auto">
          Every piece is created with deep respect for Māori culture, tikanga, and the stories of our tīpuna.
          Art as a bridge between worlds — digital and ancestral.
        </p>
      </div>
    </section>
  )
}

function SocialProof() {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">Our Whānau</p>
        <h2 className="font-serif text-4xl text-[#f5f0e8]">Join the Community</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {[
          { icon: Users, value: '50K+', label: 'TikTok Followers', sub: '@culturalaimuse' },
          { icon: Heart, value: '2M+', label: 'Total Likes', sub: 'across all platforms' },
          { icon: Eye, value: '10M+', label: 'Views', sub: 'and counting' },
        ].map(({ icon: Icon, value, label, sub }) => (
          <div key={label} className="text-center p-8 bg-[#141414] border border-[#2a2a2a] rounded-lg hover:border-[#c9a84c]/30 transition-colors">
            <Icon size={24} className="text-[#c9a84c] mx-auto mb-4" />
            <p className="font-serif text-4xl text-[#f5f0e8] mb-1">{value}</p>
            <p className="text-[#f5f0e8]/70 text-sm mb-1">{label}</p>
            <p className="text-[#9a9080] text-xs">{sub}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <a
          href="https://www.tiktok.com/@cultural.ai.muse"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-col items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <img src="/tiktok.png" alt="Follow @cultural.ai.muse on TikTok" className="h-[189px] w-auto" />
          <span className="text-[#f5f0e8] text-sm font-medium">Follow us on TikTok</span>
          <span className="text-[#c9a84c] text-xs tracking-widest">@cultural.ai.muse</span>
        </a>
      </div>
    </section>
  )
}
