import { useState, useEffect, useRef } from 'react'
import { Upload, Package, ShoppingBag, Plus, Eye, EyeOff, Loader, CheckCircle, X } from 'lucide-react'
import { CATEGORIES } from '../data/placeholderProducts'
import { api } from '../lib/api'

const TABS = ['Products', 'Add New', 'Orders']

export default function Admin() {
  const [tab, setTab] = useState('Products')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getProducts()
      .then(setProducts)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function toggleActive(id) {
    const p = products.find(p => p.id === id)
    await api.updateProduct(id, { is_active: !p.is_active }).catch(() => {})
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_active: !p.is_active } : p))
  }

  async function toggleFeatured(id) {
    const p = products.find(p => p.id === id)
    await api.updateProduct(id, { is_featured: !p.is_featured }).catch(() => {})
    setProducts(prev => prev.map(p => p.id === id ? { ...p, is_featured: !p.is_featured } : p))
  }

  function onProductAdded(product) {
    setProducts(prev => [product, ...prev])
    setTab('Products')
  }

  return (
    <div className="pt-24 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-10">
          <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-2">Admin Dashboard</p>
          <h1 className="font-serif text-4xl text-[#f5f0e8]">Manage Your Art</h1>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Works', value: products.length, icon: Package },
            { label: 'Active', value: products.filter(p => p.is_active).length, icon: Eye },
            { label: 'Featured', value: products.filter(p => p.is_featured).length, icon: Package },
            { label: 'Orders', value: '—', icon: ShoppingBag },
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
                tab === t ? 'bg-[#c9a84c] text-[#0a0a0a] font-semibold' : 'text-[#9a9080] hover:text-[#f5f0e8]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === 'Products' && (
          <ProductsTab products={products} loading={loading} toggleActive={toggleActive} toggleFeatured={toggleFeatured} />
        )}
        {tab === 'Add New' && <AddProductTab onSuccess={onProductAdded} />}
        {tab === 'Orders' && <OrdersTab />}
      </div>
    </div>
  )
}

function ProductsTab({ products, loading, toggleActive, toggleFeatured }) {
  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <Loader size={24} className="text-[#c9a84c] animate-spin" />
    </div>
  )
  if (!products.length) return (
    <div className="text-center py-16">
      <p className="font-serif text-2xl text-[#f5f0e8]/40 mb-3">No products yet</p>
      <p className="text-[#9a9080] text-sm">Add your first artwork using the "Add New" tab.</p>
    </div>
  )
  return (
    <div className="space-y-3">
      {products.map(p => (
        <div key={p.id} className="flex items-center gap-4 p-4 bg-[#141414] border border-[#2a2a2a] rounded-lg hover:border-[#c9a84c]/20 transition-colors">
          {p.image_url
            ? <img src={p.image_url} alt={p.title} className="w-14 h-14 object-cover rounded flex-shrink-0" />
            : <div className="w-14 h-14 bg-[#1e1e1e] rounded flex-shrink-0" />
          }
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

function AddProductTab({ onSuccess }) {
  const [form, setForm] = useState({
    title: '', description: '', price: '', category: 'Portraits',
    tags: '', is_active: true, is_featured: false,
  })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef()

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function uploadToCloudinary(file) {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    if (!cloudName) throw new Error('VITE_CLOUDINARY_CLOUD_NAME not set')

    // Get signed upload params from our API
    const { signature, timestamp, api_key, folder } = await api.getCloudinarySignature('cultural-ai-muse/products')

    const formData = new FormData()
    formData.append('file', file)
    formData.append('api_key', api_key)
    formData.append('timestamp', timestamp)
    formData.append('signature', signature)
    formData.append('folder', folder)

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body: formData,
    })
    if (!res.ok) throw new Error('Cloudinary upload failed')
    const data = await res.json()
    return data.secure_url
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!imageFile && !form.image_url) {
      setError('Please select an image to upload.')
      return
    }

    setSubmitting(true)
    try {
      let image_url = form.image_url || ''

      if (imageFile) {
        setUploading(true)
        image_url = await uploadToCloudinary(imageFile)
        setUploading(false)
      }

      const product = await api.createProduct({ ...form, image_url })
      onSuccess(product)
    } catch (err) {
      setError(err.message || 'Failed to save product. Check your environment variables.')
      setUploading(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {/* Image upload */}
      <div>
        <label className="text-[#f5f0e8] text-xs tracking-widest uppercase mb-2 block">Artwork Image</label>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />

        {imagePreview ? (
          <div className="relative rounded-lg overflow-hidden aspect-video bg-[#141414]">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
            <button
              type="button"
              onClick={() => { setImageFile(null); setImagePreview(null) }}
              className="absolute top-2 right-2 bg-[#0a0a0a]/80 text-[#f5f0e8] p-1 rounded hover:text-red-400"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div
            onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-[#2a2a2a] rounded-lg p-12 text-center hover:border-[#c9a84c]/40 transition-colors cursor-pointer"
          >
            <Upload size={24} className="text-[#9a9080] mx-auto mb-3" />
            <p className="text-[#9a9080] text-sm">Click to upload your artwork</p>
            <p className="text-[#9a9080] text-xs mt-1">JPG, PNG · Max 20MB · Min 3000px recommended</p>
          </div>
        )}
        {uploading && (
          <p className="text-[#c9a84c] text-xs mt-2 flex items-center gap-2">
            <Loader size={12} className="animate-spin" /> Uploading to Cloudinary…
          </p>
        )}
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
            {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
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

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="flex items-center gap-2 bg-[#c9a84c] text-[#0a0a0a] px-8 py-3 rounded font-semibold text-sm tracking-wider uppercase hover:bg-[#e8c97a] transition-colors disabled:opacity-50"
      >
        {submitting ? <><Loader size={14} className="animate-spin" /> Saving…</> : <><Plus size={16} /> Add Artwork</>}
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
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getOrders()
      .then(setOrders)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <Loader size={24} className="text-[#c9a84c] animate-spin" />
    </div>
  )

  if (!orders.length) return (
    <div className="text-center py-16">
      <ShoppingBag size={36} className="text-[#2a2a2a] mx-auto mb-4" />
      <p className="font-serif text-2xl text-[#f5f0e8]/40 mb-3">No orders yet</p>
      <p className="text-[#9a9080] text-sm">Orders will appear here once Stripe is connected and your first sale comes in.</p>
    </div>
  )

  return (
    <div className="space-y-3">
      {orders.map(o => (
        <div key={o.id} className="flex items-center gap-4 p-4 bg-[#141414] border border-[#2a2a2a] rounded-lg">
          <div className="flex-1">
            <p className="text-[#f5f0e8] text-sm">{o.customer_email}</p>
            <p className="text-[#9a9080] text-xs">{new Date(o.created_at).toLocaleDateString('en-AU')}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded border ${
            o.status === 'paid'
              ? 'border-green-800/50 text-green-400 bg-green-900/10'
              : 'border-[#2a2a2a] text-[#9a9080]'
          }`}>{o.status}</span>
          <span className="text-[#c9a84c] font-medium text-sm">${o.total}</span>
        </div>
      ))}
    </div>
  )
}
