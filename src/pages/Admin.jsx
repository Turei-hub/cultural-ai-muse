import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Upload, Package, ShoppingBag, Plus, Eye, EyeOff,
  Loader, X, Trash2, Edit2, Save, LogOut, FileText, Link, Settings, Home
} from 'lucide-react'
import { CATEGORIES } from '../data/placeholderProducts'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'

const TABS = [
  { id: 'products', label: 'Products', icon: Package },
  { id: 'add', label: 'Add New', icon: Plus },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'about', label: 'About Page', icon: FileText },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Admin() {
  const [tab, setTab] = useState('products')
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { logout } = useAuth()
  const navigate = useNavigate()

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

  async function deleteProduct(id) {
    if (!confirm('Delete this artwork? This cannot be undone.')) return
    await api.deleteProduct(id).catch(() => {})
    setProducts(prev => prev.filter(p => p.id !== id))
  }

  function onProductAdded(product) {
    setProducts(prev => [product, ...prev])
    setTab('products')
  }

  function handleLogout() {
    logout()
    navigate('/admin/login')
  }

  const ActiveTab = TABS.find(t => t.id === tab)

  return (
    <div className="pt-20 min-h-screen bg-[#0a0a0a]">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[#c9a84c] text-xs tracking-[0.3em] uppercase mb-1">Admin Portal</p>
            <h1 className="font-serif text-3xl text-[#f5f0e8]">Cultural AI Muse</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-[#9a9080] text-sm hover:text-[#c9a84c] transition-colors border border-[#2a2a2a] px-4 py-2 rounded hover:border-[#c9a84c]/30"
            >
              <Home size={14} />
              View Site
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-[#9a9080] text-sm hover:text-red-400 transition-colors border border-[#2a2a2a] px-4 py-2 rounded hover:border-red-400/30"
            >
              <LogOut size={14} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Works', value: products.length },
            { label: 'Active', value: products.filter(p => p.is_active).length },
            { label: 'Featured', value: products.filter(p => p.is_featured).length },
            { label: 'Orders', value: '—' },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[#141414] border border-[#2a2a2a] rounded-lg p-4">
              <p className="font-serif text-3xl text-[#c9a84c]">{value}</p>
              <p className="text-[#9a9080] text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 mb-8 bg-[#141414] border border-[#2a2a2a] rounded-lg p-1 overflow-x-auto">
          {TABS.map(t => {
            const Icon = t.icon
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase rounded whitespace-nowrap transition-all duration-200 ${
                  tab === t.id ? 'bg-[#c9a84c] text-[#0a0a0a] font-semibold' : 'text-[#9a9080] hover:text-[#f5f0e8]'
                }`}
              >
                <Icon size={13} />
                {t.label}
              </button>
            )
          })}
        </div>

        {tab === 'products' && (
          <ProductsTab products={products} loading={loading} toggleActive={toggleActive} toggleFeatured={toggleFeatured} deleteProduct={deleteProduct} />
        )}
        {tab === 'add' && <AddProductTab onSuccess={onProductAdded} />}
        {tab === 'orders' && <OrdersTab />}
        {tab === 'about' && <AboutTab />}
        {tab === 'settings' && <SettingsTab />}
      </div>
    </div>
  )
}

/* ── Products Tab ─────────────────────────────────── */
function ProductsTab({ products, loading, toggleActive, toggleFeatured, deleteProduct }) {
  const [editing, setEditing] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving] = useState(false)

  function startEdit(p) {
    setEditing(p.id)
    setEditForm({ title: p.title, description: p.description, price: p.price, category: p.category, tags: Array.isArray(p.tags) ? p.tags.join(', ') : p.tags })
  }

  async function saveEdit(id) {
    setSaving(true)
    await api.updateProduct(id, {
      ...editForm,
      price: parseFloat(editForm.price),
      tags: editForm.tags.split(',').map(t => t.trim()).filter(Boolean),
    }).catch(() => {})
    setSaving(false)
    setEditing(null)
  }

  if (loading) return <div className="flex items-center justify-center py-16"><Loader size={24} className="text-[#c9a84c] animate-spin" /></div>
  if (!products.length) return (
    <div className="text-center py-16">
      <p className="font-serif text-2xl text-[#f5f0e8]/40 mb-3">No products yet</p>
      <p className="text-[#9a9080] text-sm">Use "Add New" to upload your first artwork.</p>
    </div>
  )

  return (
    <div className="space-y-3">
      {products.map(p => (
        <div key={p.id} className="bg-[#141414] border border-[#2a2a2a] rounded-lg overflow-hidden hover:border-[#c9a84c]/20 transition-colors">
          {editing === p.id ? (
            /* Edit mode */
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Title" value={editForm.title} onChange={v => setEditForm(f => ({ ...f, title: v }))} />
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Price (AUD)" value={editForm.price} onChange={v => setEditForm(f => ({ ...f, price: v }))} type="number" />
                  <div>
                    <label className="text-[#f5f0e8] text-xs tracking-widest uppercase mb-2 block">Category</label>
                    <select
                      value={editForm.category}
                      onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))}
                      className="w-full bg-[#1e1e1e] border border-[#2a2a2a] text-[#f5f0e8] text-sm px-3 py-2 rounded focus:outline-none focus:border-[#c9a84c]"
                    >
                      {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <Field label="Description" value={editForm.description} onChange={v => setEditForm(f => ({ ...f, description: v }))} multiline />
              <Field label="Tags (comma-separated)" value={editForm.tags} onChange={v => setEditForm(f => ({ ...f, tags: v }))} />
              <div className="flex gap-3">
                <button
                  onClick={() => saveEdit(p.id)}
                  disabled={saving}
                  className="flex items-center gap-2 bg-[#c9a84c] text-[#0a0a0a] px-5 py-2 rounded text-xs font-semibold uppercase tracking-wider hover:bg-[#e8c97a] disabled:opacity-50"
                >
                  {saving ? <Loader size={12} className="animate-spin" /> : <Save size={12} />}
                  Save Changes
                </button>
                <button onClick={() => setEditing(null)} className="text-[#9a9080] text-xs px-4 py-2 border border-[#2a2a2a] rounded hover:border-[#c9a84c]/30">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* View mode */
            <div className="flex items-center gap-4 p-4">
              {p.image_url
                ? <img src={p.image_url} alt={p.title} className="w-16 h-16 object-cover rounded flex-shrink-0" />
                : <div className="w-16 h-16 bg-[#1e1e1e] rounded flex-shrink-0" />
              }
              <div className="flex-1 min-w-0">
                <p className="text-[#f5f0e8] text-sm font-medium truncate">{p.title}</p>
                <p className="text-[#9a9080] text-xs">{p.category} · ${p.price}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => toggleFeatured(p.id)}
                  className={`text-xs px-2 py-1 rounded border transition-colors ${
                    p.is_featured ? 'border-[#c9a84c]/50 text-[#c9a84c] bg-[#c9a84c]/10' : 'border-[#2a2a2a] text-[#9a9080] hover:border-[#c9a84c]/30'
                  }`}
                >Featured</button>
                <button
                  onClick={() => toggleActive(p.id)}
                  className={`p-2 rounded border transition-colors ${
                    p.is_active ? 'border-green-800/50 text-green-400' : 'border-[#2a2a2a] text-[#9a9080]'
                  }`}
                  title={p.is_active ? 'Active' : 'Hidden'}
                >
                  {p.is_active ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button onClick={() => startEdit(p)} className="p-2 rounded border border-[#2a2a2a] text-[#9a9080] hover:text-[#c9a84c] hover:border-[#c9a84c]/30 transition-colors">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => deleteProduct(p.id)} className="p-2 rounded border border-[#2a2a2a] text-[#9a9080] hover:text-red-400 hover:border-red-400/30 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

/* ── Add Product Tab ──────────────────────────────── */
function AddProductTab({ onSuccess }) {
  const [form, setForm] = useState({ title: '', description: '', price: '', category: 'Portraits', tags: '', is_active: true, is_featured: false })
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
    const { signature, timestamp, api_key, folder } = await api.getCloudinarySignature('cultural-ai-muse/products')
    const formData = new FormData()
    formData.append('file', file)
    formData.append('api_key', api_key)
    formData.append('timestamp', timestamp)
    formData.append('signature', signature)
    formData.append('folder', folder)
    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: formData })
    if (!res.ok) throw new Error('Cloudinary upload failed')
    return (await res.json()).secure_url
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!imageFile) { setError('Please select an image.'); return }
    setSubmitting(true)
    try {
      setUploading(true)
      const image_url = await uploadToCloudinary(imageFile)
      setUploading(false)
      const product = await api.createProduct({ ...form, image_url })
      onSuccess(product)
    } catch (err) {
      setError(err.message || 'Failed to save. Check your environment variables.')
      setUploading(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      <div>
        <label className="text-[#f5f0e8] text-xs tracking-widest uppercase mb-2 block">Artwork Image</label>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        {imagePreview ? (
          <div className="relative rounded-lg overflow-hidden aspect-video bg-[#141414]">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
            <button type="button" onClick={() => { setImageFile(null); setImagePreview(null) }}
              className="absolute top-2 right-2 bg-[#0a0a0a]/80 text-[#f5f0e8] p-1 rounded hover:text-red-400">
              <X size={14} />
            </button>
          </div>
        ) : (
          <div onClick={() => inputRef.current?.click()}
            className="border-2 border-dashed border-[#2a2a2a] rounded-lg p-12 text-center hover:border-[#c9a84c]/40 transition-colors cursor-pointer">
            <Upload size={24} className="text-[#9a9080] mx-auto mb-3" />
            <p className="text-[#9a9080] text-sm">Click to upload artwork</p>
            <p className="text-[#9a9080] text-xs mt-1">JPG, PNG · Max 20MB</p>
          </div>
        )}
        {uploading && <p className="text-[#c9a84c] text-xs mt-2 flex items-center gap-2"><Loader size={12} className="animate-spin" /> Uploading to Cloudinary…</p>}
      </div>
      <Field label="Title" value={form.title} onChange={v => set('title', v)} placeholder="e.g. Tāne Mahuta — Forest Guardian" required />
      <Field label="Description" value={form.description} onChange={v => set('description', v)} placeholder="Describe the cultural significance..." multiline />
      <div className="grid grid-cols-2 gap-4">
        <Field label="Price (AUD)" value={form.price} onChange={v => set('price', v)} placeholder="35" type="number" required />
        <div>
          <label className="text-[#f5f0e8] text-xs tracking-widest uppercase mb-2 block">Category</label>
          <select value={form.category} onChange={e => set('category', e.target.value)}
            className="w-full bg-[#1e1e1e] border border-[#2a2a2a] text-[#f5f0e8] text-sm px-3 py-2.5 rounded focus:outline-none focus:border-[#c9a84c]">
            {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <Field label="Tags (comma-separated)" value={form.tags} onChange={v => set('tags', v)} placeholder="portrait, atua, gold" />
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
      <button type="submit" disabled={submitting}
        className="flex items-center gap-2 bg-[#c9a84c] text-[#0a0a0a] px-8 py-3 rounded font-semibold text-sm tracking-wider uppercase hover:bg-[#e8c97a] transition-colors disabled:opacity-50">
        {submitting ? <><Loader size={14} className="animate-spin" /> Saving…</> : <><Plus size={14} /> Add Artwork</>}
      </button>
    </form>
  )
}

/* ── Orders Tab ───────────────────────────────────── */
function OrdersTab() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getOrders().then(setOrders).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="flex items-center justify-center py-16"><Loader size={24} className="text-[#c9a84c] animate-spin" /></div>
  if (!orders.length) return (
    <div className="text-center py-16">
      <ShoppingBag size={36} className="text-[#2a2a2a] mx-auto mb-4" />
      <p className="font-serif text-2xl text-[#f5f0e8]/40 mb-3">No orders yet</p>
      <p className="text-[#9a9080] text-sm">Orders appear here once Stripe is connected.</p>
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
          <span className={`text-xs px-2 py-1 rounded border ${o.status === 'paid' ? 'border-green-800/50 text-green-400' : 'border-[#2a2a2a] text-[#9a9080]'}`}>
            {o.status}
          </span>
          <span className="text-[#c9a84c] font-medium">${o.total}</span>
        </div>
      ))}
    </div>
  )
}

/* ── About Tab ────────────────────────────────────── */
function AboutTab() {
  const [form, setForm] = useState({ creator_name: '', story: '', tiktok_handle: '', tiktok_url: '', kaupapa: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/about').then(r => r.json()).then(data => { setForm(data); setLoading(false) }).catch(() => setLoading(false))
  }, [])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    await fetch('/api/about', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  function set(k, v) { setForm(f => ({ ...f, [k]: v })) }

  if (loading) return <div className="flex items-center justify-center py-16"><Loader size={24} className="text-[#c9a84c] animate-spin" /></div>

  return (
    <form onSubmit={handleSave} className="max-w-2xl space-y-6">
      <Field label="Creator Name" value={form.creator_name} onChange={v => set('creator_name', v)} placeholder="Your name" />
      <Field label="Your Story" value={form.story} onChange={v => set('story', v)} placeholder="Tell your story..." multiline />
      <Field label="Kaupapa Statement" value={form.kaupapa} onChange={v => set('kaupapa', v)} placeholder="Your cultural commitment..." multiline />

      <div className="bg-[#141414] border border-[#2a2a2a] rounded-lg p-5">
        <div className="flex items-center gap-2 mb-4">
          <Link size={14} className="text-[#c9a84c]" />
          <p className="text-[#f5f0e8] text-xs tracking-widest uppercase">TikTok</p>
        </div>
        <div className="space-y-4">
          <Field label="TikTok Handle" value={form.tiktok_handle} onChange={v => set('tiktok_handle', v)} placeholder="@yourhandle" />
          <Field label="TikTok Profile URL" value={form.tiktok_url} onChange={v => set('tiktok_url', v)} placeholder="https://www.tiktok.com/@yourhandle" />
        </div>
      </div>

      <button type="submit" disabled={saving}
        className={`flex items-center gap-2 px-8 py-3 rounded font-semibold text-sm tracking-wider uppercase transition-colors disabled:opacity-50 ${
          saved ? 'bg-green-700 text-white' : 'bg-[#c9a84c] text-[#0a0a0a] hover:bg-[#e8c97a]'
        }`}>
        {saving ? <><Loader size={14} className="animate-spin" /> Saving…</> : saved ? '✓ Saved!' : <><Save size={14} /> Save Changes</>}
      </button>
    </form>
  )
}

/* ── Settings Tab ─────────────────────────────────── */
function SettingsTab() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-lg p-6">
        <h3 className="font-serif text-xl text-[#f5f0e8] mb-2">Admin Credentials</h3>
        <p className="text-[#9a9080] text-sm mb-4 leading-relaxed">
          Your admin username and password are set via environment variables in Vercel. To change them:
        </p>
        <ol className="space-y-2 text-[#9a9080] text-sm list-decimal list-inside">
          <li>Go to <span className="text-[#c9a84c]">Vercel → Settings → Environment Variables</span></li>
          <li>Update <span className="text-[#f5f0e8] font-mono text-xs bg-[#1e1e1e] px-1 py-0.5 rounded">VITE_ADMIN_USERNAME</span> and <span className="text-[#f5f0e8] font-mono text-xs bg-[#1e1e1e] px-1 py-0.5 rounded">VITE_ADMIN_PASSWORD</span></li>
          <li>Redeploy the site</li>
        </ol>
      </div>

      <div className="bg-[#141414] border border-[#2a2a2a] rounded-lg p-6">
        <h3 className="font-serif text-xl text-[#f5f0e8] mb-2">Connected Services</h3>
        <div className="space-y-3 mt-4">
          {[
            { name: 'Cloudinary', status: !!import.meta.env.VITE_CLOUDINARY_CLOUD_NAME, detail: 'Image storage & delivery' },
            { name: 'MongoDB', status: false, detail: 'Database (configure MONGODB_URI in Vercel)' },
            { name: 'Stripe', status: !!import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY, detail: 'Payments' },
          ].map(s => (
            <div key={s.name} className="flex items-center justify-between py-3 border-b border-[#2a2a2a] last:border-0">
              <div>
                <p className="text-[#f5f0e8] text-sm">{s.name}</p>
                <p className="text-[#9a9080] text-xs">{s.detail}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded border ${s.status ? 'border-green-800/50 text-green-400 bg-green-900/10' : 'border-[#2a2a2a] text-[#9a9080]'}`}>
                {s.status ? 'Connected' : 'Not configured'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Shared Field component ───────────────────────── */
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
