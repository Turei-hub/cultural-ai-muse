import { useState } from 'react'
import { Upload, Package, ShoppingBag, Plus, Eye, EyeOff, Trash2, Edit } from 'lucide-react'
import { PLACEHOLDER_PRODUCTS, CATEGORIES } from '../data/placeholderProducts'

const TABS = ['Products', 'Add New', 'Orders']

export default function Admin() {
  const [tab, setTab] = useState('Products')
  const [products, setProducts] = useState(PLACEHOLDER_PRODUCTS)

  function toggleActive(id) {
    setProducts(prev =>
      prev.map(p => p.id === id ? { ...p, is_active: !p.is_active } : p)
    )
  }
  function toggleFeatured(id) {
    setProducts(prev =>
      prev.map(p => p.id === id ? { ...p, is_featured: !p.is_featured } : p)
    )
  }

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">Admin Dashboard</p>
          <h1 className="font-serif text-4xl text-[#f5f0e8]">Manage Your Art</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Works', value: products.length, icon: Package },
            { label: 'Active', value: products.filter(p => p.is_active).length, icon: Eye },
            { label: 'Featured', value: products.filter(p => p.is_featured).length, icon: ShoppingBag },
            { label: 'Orders', value: 0, icon: ShoppingBag },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-[#141414] border border-[#2a2a2a] rounded-lg p-5">
              <Icon size={18} className="text-[#c9a84c] mb-3" />
              <p className="font-serif text-3xl text-[#f5f0e8]">{value}</p>
              <p className="text-[#9a9080] text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-[#141414] border border-[#2a2a2a] rounded-lg p-1 w-fit">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 text-xs tracking-widest uppercase rounded transition-all duration-200 ${
                tab === t
                  ? 'bg-[#c9a84c] text-[#0a0a0a] font-semibold'
                  : 'text-[#9a9080] hover:text-[#f5f0e8]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'Products' && (
          <ProductsTab products={products} toggleActive={toggleActive} toggleFeatured={toggleFeatured} />
        )}
        {tab === 'Add New' && <AddProductTab />}
        {tab === 'Orders' && <OrdersTab />}
      </div>
    </div>
  )
}

function ProductsTab({ products, toggleActive, toggleFeatured }) {
  return (
    <div className="space-y-3">
      {products.map(p => (
        <div key={p.id} className="flex items-center gap-4 p-4 bg-[#141414] border border-[#2a2a2a] rounded-lg hover:border-[#c9a84c]/20 transition-colors">
          <img src={p.image_url} alt={p.title} className="w-14 h-14 object-cover rounded" />
          <div className="flex-1 min-w-0">
            <p className="text-[#f5f0e8] text-sm font-medium truncate">{p.title}</p>
            <p className="text-[#9a9080] text-xs">{p.category} · ${p.price}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleFeatured(p.id)}
              className={`text-xs px-2 py-1 rounded border transition-colors ${
                p.is_featured
                  ? 'border-[#c9a84c]/50 text-[#c9a84c] bg-[#c9a84c]/10'
                  : 'border-[#2a2a2a] text-[#9a9080] hover:border-[#c9a84c]/30'
              }`}
            >
              Featured
            </button>
            <button
              onClick={() => toggleActive(p.id)}
              className={`p-2 rounded border transition-colors ${
                p.is_active
                  ? 'border-green-800/50 text-green-400 bg-green-900/10'
                  : 'border-[#2a2a2a] text-[#9a9080]'
              }`}
              title={p.is_active ? 'Active — click to hide' : 'Hidden — click to show'}
            >
              {p.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function AddProductTab() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    category: 'Portraits',
    tags: '',
    is_active: true,
    is_featured: false,
  })
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  function set(k, v) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    // In production: upload image to Supabase Storage, insert row to products table
    await new Promise(r => setTimeout(r, 1000))
    setDone(true)
    setSubmitting(false)
  }

  if (done) {
    return (
      <div className="text-center py-16">
        <p className="font-serif text-3xl text-[#c9a84c] mb-3">Tino pai! 🎉</p>
        <p className="text-[#9a9080] text-sm mb-6">Product saved successfully.</p>
        <button onClick={() => { setDone(false); setForm({ title:'',description:'',price:'',category:'Portraits',tags:'',is_active:true,is_featured:false }) }}
          className="text-[#c9a84c] text-sm hover:underline">Add another</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {/* Image upload */}
      <div>
        <label className="text-[#f5f0e8] text-xs tracking-widest uppercase mb-2 block">Artwork Image</label>
        <div className="border-2 border-dashed border-[#2a2a2a] rounded-lg p-12 text-center hover:border-[#c9a84c]/40 transition-colors cursor-pointer">
          <Upload size={24} className="text-[#9a9080] mx-auto mb-3" />
          <p className="text-[#9a9080] text-sm">Drop image here or click to upload</p>
          <p className="text-[#9a9080] text-xs mt-1">JPG, PNG · Max 20MB · Min 3000px</p>
        </div>
      </div>

      <Field label="Title" value={form.title} onChange={v => set('title', v)} placeholder="e.g. Tāne Mahuta — Forest Guardian" required />
      <Field label="Description" value={form.description} onChange={v => set('description', v)} placeholder="Describe the cultural significance and visual composition..." multiline />

      <div className="grid grid-cols-2 gap-4">
        <Field label="Price (AUD)" value={form.price} onChange={v => set('price', v)} placeholder="35" type="number" required />
        <div>
          <label className="text-[#f5f0e8] text-xs tracking-widest uppercase mb-2 block">Category</label>
          <select
            value={form.category}
            onChange={e => set('category', e.target.value)}
            className="w-full bg-[#1e1e1e] border border-[#2a2a2a] text-[#f5f0e8] text-sm px-3 py-2.5 rounded focus:outline-none focus:border-[#c9a84c]"
          >
            {CATEGORIES.filter(c => c !== 'All').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <Field label="Tags (comma-separated)" value={form.tags} onChange={v => set('tags', v)} placeholder="portrait, atua, gold, whenua" />

      <div className="flex gap-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} className="accent-[#c9a84c] w-4 h-4" />
          <span className="text-[#f5f0e8] text-sm">Active (visible in shop)</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} className="accent-[#c9a84c] w-4 h-4" />
          <span className="text-[#f5f0e8] text-sm">Featured (homepage)</span>
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="flex items-center gap-2 bg-[#c9a84c] text-[#0a0a0a] px-8 py-3 rounded font-semibold text-sm tracking-wider uppercase hover:bg-[#e8c97a] transition-colors disabled:opacity-50"
      >
        <Plus size={16} />
        {submitting ? 'Saving...' : 'Add Artwork'}
      </button>
    </form>
  )
}

function Field({ label, value, onChange, placeholder, multiline, type = 'text', required }) {
  const cls = "w-full bg-[#1e1e1e] border border-[#2a2a2a] text-[#f5f0e8] text-sm px-3 py-2.5 rounded focus:outline-none focus:border-[#c9a84c] placeholder:text-[#9a9080]/50"
  return (
    <div>
      <label className="text-[#f5f0e8] text-xs tracking-widest uppercase mb-2 block">{label}</label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={4} className={cls} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} required={required} className={cls} />
      }
    </div>
  )
}

function OrdersTab() {
  return (
    <div className="text-center py-16">
      <ShoppingBag size={36} className="text-[#2a2a2a] mx-auto mb-4" />
      <p className="font-serif text-2xl text-[#f5f0e8]/40 mb-3">No orders yet</p>
      <p className="text-[#9a9080] text-sm">Orders will appear here once Stripe is connected and your first sale comes in.</p>
    </div>
  )
}
