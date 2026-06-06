import { ExternalLink, Heart } from 'lucide-react'

export default function About() {
  return (
    <div className="pt-24 min-h-screen">
      {/* Hero */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=60)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'brightness(0.3) saturate(0.5)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-transparent to-[#0a0a0a]" />
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-6">About the Creator</p>
          <h1 className="font-serif text-5xl md:text-6xl text-[#f5f0e8] mb-6 leading-tight">
            Kia ora, ko au tēnei
          </h1>
          <p className="text-[#9a9080] text-lg italic">I am this one — I am myself.</p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-6 pb-24">
        {/* Story */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="aspect-[3/4] rounded-lg overflow-hidden bg-[#141414] border border-[#2a2a2a] relative">
                <img
                  src="https://images.unsplash.com/photo-1494783367193-149034c05e8f?w=600&q=80"
                  alt="Aotearoa landscape"
                  className="w-full h-full object-cover"
                />
                <div className="absolute -bottom-3 -right-3 w-16 h-16 border-b border-r border-[#c9a84c]/40" />
              </div>
            </div>
            <div>
              <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">My Story</p>
              <h2 className="font-serif text-3xl text-[#f5f0e8] mb-6 leading-tight">
                Art as a Bridge Between Worlds
              </h2>
              <div className="space-y-4 text-[#9a9080] text-sm leading-relaxed">
                <p>
                  Ko tōku tīpuna i heke mai i Aotearoa. My ancestors came from the land of the long white cloud, and though I now call Australia home, Aotearoa lives in my heart and in every piece I create.
                </p>
                <p>
                  I came to AI art as a way to explore and celebrate the stories, atua, and landscapes that shaped my identity. What started as a personal creative practice became a community — and now, a way to share Māori cultural imagery with the world.
                </p>
                <p>
                  Every artwork begins with deep research and reflection. I work with kaumātua in spirit, drawing on oral traditions, whakapapa, and the visual language of our tīpuna. AI is just the brush — the intention and the aroha are entirely human.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Kaupapa */}
        <section className="mb-20 bg-[#141414] border border-[#2a2a2a] rounded-lg p-10">
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-6">Cultural Kaupapa</p>
          <h2 className="font-serif text-3xl text-[#f5f0e8] mb-6">Our Cultural Commitment</h2>
          <div className="space-y-4 text-[#9a9080] text-sm leading-relaxed">
            <p>
              <strong className="text-[#f5f0e8]">Manaakitanga</strong> — We approach every creation with respect and care for the culture being celebrated. No sacred tapu imagery is replicated. Tā moko-inspired elements are kept minimal and respectful, and are never intended to represent actual tā moko.
            </p>
            <p>
              <strong className="text-[#f5f0e8]">Kaitiakitanga</strong> — As a digital creator, I see myself as a guardian of cultural narratives. I am constantly learning, listening, and adjusting. If a work causes offense, I want to know, and I will act.
            </p>
            <p>
              <strong className="text-[#f5f0e8]">Whanaungatanga</strong> — A portion of proceeds supports Māori cultural organisations in both Aotearoa and Australia. This art belongs to the whānau.
            </p>
          </div>
        </section>

        {/* TikTok */}
        <section className="mb-20 text-center">
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-4">TikTok</p>
          <h2 className="font-serif text-3xl text-[#f5f0e8] mb-4">Watch the Creative Process</h2>
          <p className="text-[#9a9080] text-sm mb-8 max-w-md mx-auto">
            Follow along on TikTok where I share behind-the-scenes creation, cultural context, and new art drops before they hit the shop.
          </p>
          <a
            href="https://www.tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#141414] border border-[#2a2a2a] text-[#f5f0e8] px-8 py-4 rounded text-sm hover:border-[#c9a84c]/40 hover:text-[#c9a84c] transition-colors"
          >
            <ExternalLink size={16} />
            @culturalaimuse on TikTok
          </a>

          {/* Placeholder for TikTok embed */}
          <div className="mt-8 bg-[#141414] border border-[#2a2a2a] rounded-lg p-12 max-w-sm mx-auto">
            <p className="text-[#9a9080] text-xs">TikTok embed will appear here</p>
            <p className="text-[#9a9080] text-[10px] mt-2">Add your TikTok profile widget URL to enable</p>
          </div>
        </section>

        {/* Values */}
        <section>
          <div className="koru-divider mb-12">
            <span className="text-[#9a9080] text-xs tracking-[0.3em] uppercase whitespace-nowrap px-4">Values</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                te_reo: 'Aroha',
                english: 'Love',
                description: 'Every piece is made with love for the culture, the stories, and the people who carry them.',
              },
              {
                te_reo: 'Mana',
                english: 'Prestige & Authority',
                description: 'Elevating Māori imagery to its rightful place — beautiful, proud, and powerful.',
              },
              {
                te_reo: 'Wairua',
                english: 'Spirit',
                description: 'Art that carries spiritual intention, honouring the wairua of the atua and tīpuna.',
              },
            ].map(v => (
              <div key={v.te_reo} className="p-6 bg-[#141414] border border-[#2a2a2a] rounded-lg text-center hover:border-[#c9a84c]/30 transition-colors">
                <h3 className="font-serif text-2xl text-[#c9a84c] mb-1">{v.te_reo}</h3>
                <p className="text-[#9a9080] text-xs italic mb-4">{v.english}</p>
                <p className="text-[#9a9080] text-sm leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
