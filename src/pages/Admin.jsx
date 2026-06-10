import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Upload, Package, ShoppingBag, Plus, Eye, EyeOff,
  Loader, X, Trash2, Edit2, Save, LogOut, FileText, Link, Settings, Home, GripVertical, Users, Mail, Send, CheckCircle
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { CATEGORIES } from '../data/placeholderProducts'
import { api } from '../lib/api'
import { useAuth } from '../context/AuthContext'
import { useSettings } from '../context/SettingsContext'

const TABS = [
  { id: 'products', label: 'Products', icon: Package },
  { id: 'add', label: 'Add New', icon: Plus },
  { id: 'orders', label: 'Orders', icon: ShoppingBag },
  { id: 'subscribers', label: 'Subscribers', icon: Users },
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
        {tab === 'subscribers' && <SubscribersTab />}
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

/* ── Subscribers Tab ─────────────────────────────── */
function SubscribersTab() {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    supabase
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setSubscribers(data) })
      .finally(() => setLoading(false))
  }, [])

  const filtered = subscribers.filter(s =>
    s.email.toLowerCase().includes(search.toLowerCase())
  )

  function copyEmails() {
    const emails = filtered.map(s => s.email).join(', ')
    navigator.clipboard.writeText(emails)
  }

  if (loading) return <div className="flex items-center justify-center py-16"><Loader size={24} className="text-[#c9a84c] animate-spin" /></div>

  return (
    <div className="space-y-5">
      {/* Stats + actions */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-4">
          <div className="bg-[#141414] border border-[#2a2a2a] rounded-lg px-5 py-3">
            <p className="font-serif text-3xl text-[#c9a84c]">{subscribers.length}</p>
            <p className="text-[#9a9080] text-xs mt-0.5">Total Subscribers</p>
          </div>
        </div>
        <button
          onClick={copyEmails}
          className="flex items-center gap-2 border border-[#2a2a2a] text-[#9a9080] text-xs px-4 py-2 rounded hover:border-[#c9a84c]/40 hover:text-[#c9a84c] transition-colors"
        >
          <Mail size={13} />
          Copy All Emails
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by email..."
          className="w-full bg-[#141414] border border-[#2a2a2a] text-[#f5f0e8] text-sm px-4 py-2.5 rounded focus:outline-none focus:border-[#c9a84c] placeholder:text-[#9a9080]/50"
        />
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Users size={36} className="text-[#2a2a2a] mx-auto mb-4" />
          <p className="font-serif text-2xl text-[#f5f0e8]/40 mb-2">No subscribers yet</p>
          <p className="text-[#9a9080] text-sm">Emails will appear here once people sign up.</p>
        </div>
      ) : (
        <div className="bg-[#141414] border border-[#2a2a2a] rounded-lg overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-3 px-5 py-3 border-b border-[#2a2a2a]">
            <p className="text-[#9a9080] text-xs tracking-widest uppercase col-span-2">Email</p>
            <p className="text-[#9a9080] text-xs tracking-widest uppercase">Subscribed</p>
          </div>
          {/* Rows */}
          <div className="divide-y divide-[#2a2a2a]">
            {filtered.map(s => (
              <div key={s.id} className="grid grid-cols-3 px-5 py-3 hover:bg-[#1e1e1e] transition-colors">
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-[#c9a84c]/10 border border-[#c9a84c]/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#c9a84c] text-xs font-medium">{s.email[0].toUpperCase()}</span>
                  </div>
                  <span className="text-[#f5f0e8] text-sm truncate">{s.email}</span>
                </div>
                <p className="text-[#9a9080] text-xs self-center">
                  {new Date(s.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Send Newsletter Panel */}
      <NewsletterComposer subscriberCount={subscribers.length} />
    </div>
  )
}

/* ── Newsletter Composer ──────────────────────────── */
function NewsletterComposer({ subscriberCount }) {
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const [preview, setPreview] = useState(false)
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState(null) // { success, count }

  async function handleSend() {
    if (!subject.trim() || !body.trim()) return
    if (!confirm(`Send this newsletter to ${subscriberCount} subscriber${subscriberCount !== 1 ? 's' : ''}?`)) return

    setSending(true)
    setResult(null)

    const html = `
      <div style="background:#0a0a0a;color:#f5f0e8;font-family:Georgia,serif;max-width:600px;margin:0 auto;padding:40px 32px;">
        <h1 style="color:#c9a84c;font-size:28px;margin-bottom:4px;">Cultural AI Muse</h1>
        <p style="color:#9a9080;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;margin-bottom:32px;">Māori Art & Digital Creations</p>
        <div style="line-height:1.8;color:#f5f0e8;font-size:15px;white-space:pre-wrap;">${body}</div>
        <div style="margin-top:40px;padding-top:24px;border-top:1px solid #2a2a2a;">
          <a href="https://cultural-ai-muse.vercel.app/shop"
             style="display:inline-block;background:#c9a84c;color:#0a0a0a;padding:12px 28px;text-decoration:none;font-weight:bold;letter-spacing:0.1em;text-transform:uppercase;font-size:12px;border-radius:4px;">
            View the Gallery
          </a>
        </div>
        <p style="color:#9a9080;font-size:11px;margin-top:32px;">
          © 2026 Cultural AI Muse · Based in Australia · Māori-owned
        </p>
      </div>
    `

    const { data, error } = await supabase.functions.invoke('send-newsletter', {
      body: { subject, html },
    })

    setSending(false)
    if (error) {
      setResult({ success: false })
    } else {
      setResult({ success: true, count: data?.sent || subscriberCount })
      setSubject('')
      setBody('')
    }
  }

  return (
    <div className="bg-[#141414] border border-[#2a2a2a] rounded-lg p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[#f5f0e8] text-sm font-medium flex items-center gap-2">
            <Send size={14} className="text-[#c9a84c]" />
            Send Newsletter
          </p>
          <p className="text-[#9a9080] text-xs mt-0.5">Compose and send an email to all {subscriberCount} subscribers</p>
        </div>
        <button
          onClick={() => setPreview(!preview)}
          className="text-[#9a9080] text-xs border border-[#2a2a2a] px-3 py-1.5 rounded hover:border-[#c9a84c]/40 hover:text-[#c9a84c] transition-colors"
        >
          {preview ? 'Edit' : 'Preview'}
        </button>
      </div>

      {result && (
        <div className={`flex items-center gap-2 text-xs px-4 py-3 rounded border ${result.success ? 'border-green-800/50 text-green-400 bg-green-900/10' : 'border-red-800/50 text-red-400 bg-red-900/10'}`}>
          {result.success
            ? <><CheckCircle size={14} /> Newsletter sent to {result.count} subscriber{result.count !== 1 ? 's' : ''}!</>
            : <><X size={14} /> Failed to send — check your Resend setup.</>
          }
        </div>
      )}

      {preview ? (
        <div className="border border-[#2a2a2a] rounded p-5 bg-[#0a0a0a]">
          <p className="text-[#9a9080] text-xs uppercase tracking-widest mb-1">Subject</p>
          <p className="text-[#f5f0e8] text-sm font-medium mb-4">{subject || '(no subject)'}</p>
          <div className="koru-divider mb-4" />
          <p className="text-[#9a9080] text-xs uppercase tracking-widest mb-2">Body</p>
          <p className="text-[#f5f0e8] text-sm leading-relaxed whitespace-pre-wrap">{body || '(empty)'}</p>
        </div>
      ) : (
        <>
          <div>
            <label className="text-[#f5f0e8] text-xs tracking-widest uppercase mb-2 block">Subject Line</label>
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
              placeholder="e.g. New collection just dropped — check it out 🌿"
              className="w-full bg-[#1e1e1e] border border-[#2a2a2a] text-[#f5f0e8] text-sm px-3 py-2.5 rounded focus:outline-none focus:border-[#c9a84c] placeholder:text-[#9a9080]/50"
            />
          </div>
          <div>
            <label className="text-[#f5f0e8] text-xs tracking-widest uppercase mb-2 block">Message</label>
            <textarea
              value={body}
              onChange={e => setBody(e.target.value)}
              placeholder="Kia ora whānau! We've just dropped a new collection of AI-generated Māori art..."
              rows={8}
              className="w-full bg-[#1e1e1e] border border-[#2a2a2a] text-[#f5f0e8] text-sm px-3 py-2.5 rounded focus:outline-none focus:border-[#c9a84c] placeholder:text-[#9a9080]/50 resize-none"
            />
            <p className="text-[#9a9080] text-xs mt-1">Plain text — a "View the Gallery" button is added automatically.</p>
          </div>
        </>
      )}

      <button
        onClick={handleSend}
        disabled={sending || !subject.trim() || !body.trim() || subscriberCount === 0}
        className="flex items-center gap-2 bg-[#c9a84c] text-[#0a0a0a] px-6 py-3 rounded font-semibold text-sm tracking-wider uppercase hover:bg-[#e8c97a] transition-colors disabled:opacity-40"
      >
        {sending ? <><Loader size={14} className="animate-spin" /> Sending…</> : <><Send size={14} /> Send to {subscriberCount} Subscriber{subscriberCount !== 1 ? 's' : ''}</>}
      </button>
    </div>
  )
}

/* ── Settings Tab ─────────────────────────────────── */
function SettingsTab() {
  const { settings, update } = useSettings()
  const [newItem, setNewItem] = useState('')
  const [editIndex, setEditIndex] = useState(null)
  const [editValue, setEditValue] = useState('')

  function addItem() {
    const trimmed = newItem.trim()
    if (!trimmed) return
    update('marqueeItems', [...settings.marqueeItems, trimmed])
    setNewItem('')
  }

  function removeItem(i) {
    update('marqueeItems', settings.marqueeItems.filter((_, idx) => idx !== i))
  }

  function startEdit(i) {
    setEditIndex(i)
    setEditValue(settings.marqueeItems[i])
  }

  function saveEdit(i) {
    const updated = [...settings.marqueeItems]
    updated[i] = editValue.trim() || updated[i]
    update('marqueeItems', updated)
    setEditIndex(null)
  }

  return (
    <div className="max-w-2xl space-y-4">

      {/* Newsletter Signup */}
      <SettingRow
        label="Newsletter Signup"
        description="Show the email signup form in the footer"
        checked={settings.showNewsletter}
        onChange={v => update('showNewsletter', v)}
      />

      {/* Social Stats */}
      <SettingRow
        label="Social Stats Section"
        description="Show TikTok follower counts on the homepage"
        checked={settings.showSocialStats}
        onChange={v => update('showSocialStats', v)}
      />

      {/* Maintenance Banner */}
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-lg p-5 space-y-4">
        <SettingRow
          label="Maintenance Banner"
          description="Show an announcement banner across the top of the site"
          checked={settings.maintenanceBanner}
          onChange={v => update('maintenanceBanner', v)}
          inline
        />
        {settings.maintenanceBanner && (
          <div>
            <label className="text-[#f5f0e8] text-xs tracking-widest uppercase mb-2 block">Banner Message</label>
            <input
              type="text"
              value={settings.maintenanceMessage}
              onChange={e => update('maintenanceMessage', e.target.value)}
              className="w-full bg-[#1e1e1e] border border-[#2a2a2a] text-[#f5f0e8] text-sm px-3 py-2.5 rounded focus:outline-none focus:border-[#c9a84c]"
              placeholder="e.g. New collection dropping Friday! 🌿"
            />
            <p className="text-[#9a9080] text-xs mt-2">This message appears in a gold bar at the top of every page.</p>
          </div>
        )}
      </div>

      {/* Marquee Banner Control */}
      <div className="bg-[#141414] border border-[#2a2a2a] rounded-lg p-5 space-y-4">
        <div>
          <p className="text-[#f5f0e8] text-sm font-medium">Scrolling Marquee Banner</p>
          <p className="text-[#9a9080] text-xs mt-0.5">Edit the items that scroll across the homepage banner</p>
        </div>

        {/* Preview */}
        <div className="overflow-hidden border border-[#2a2a2a] rounded bg-[#0a0a0a] py-2">
          <div className="flex gap-6 px-4 overflow-x-auto scrollbar-none">
            {settings.marqueeItems.map((item, i) => (
              <span key={i} className="flex items-center gap-2 text-[10px] tracking-widest uppercase whitespace-nowrap text-[#9a9080]">
                {item} <span className="text-[#c9a84c]">✦</span>
              </span>
            ))}
          </div>
          <p className="text-[#9a9080] text-[10px] text-center mt-1 opacity-50">Preview</p>
        </div>

        {/* Current items list */}
        <div className="space-y-2">
          {settings.marqueeItems.map((item, i) => (
            <div key={i} className="flex items-center gap-2 bg-[#1e1e1e] border border-[#2a2a2a] rounded px-3 py-2">
              <GripVertical size={12} className="text-[#2a2a2a] flex-shrink-0" />
              {editIndex === i ? (
                <>
                  <input
                    autoFocus
                    type="text"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') saveEdit(i); if (e.key === 'Escape') setEditIndex(null) }}
                    className="flex-1 bg-transparent text-[#f5f0e8] text-xs focus:outline-none"
                  />
                  <button onClick={() => saveEdit(i)} className="text-[#c9a84c] text-xs hover:text-[#e8c97a]"><Save size={12} /></button>
                  <button onClick={() => setEditIndex(null)} className="text-[#9a9080] text-xs hover:text-[#f5f0e8]"><X size={12} /></button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-[#f5f0e8] text-xs">{item}</span>
                  <button onClick={() => startEdit(i)} className="text-[#9a9080] hover:text-[#c9a84c] transition-colors"><Edit2 size={12} /></button>
                  <button onClick={() => removeItem(i)} className="text-[#9a9080] hover:text-red-400 transition-colors"><Trash2 size={12} /></button>
                </>
              )}
            </div>
          ))}
        </div>

        {/* Add new item */}
        <div>
          <label className="text-[#f5f0e8] text-xs tracking-widest uppercase mb-2 block">Add New Item</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newItem}
              onChange={e => setNewItem(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addItem()}
              placeholder="e.g. New Collection Available Now"
              className="flex-1 bg-[#1e1e1e] border border-[#2a2a2a] text-[#f5f0e8] text-sm px-3 py-2.5 rounded focus:outline-none focus:border-[#c9a84c] placeholder:text-[#9a9080]/50"
            />
            <button
              onClick={addItem}
              className="bg-[#c9a84c] text-[#0a0a0a] px-4 py-2 rounded text-xs font-semibold uppercase tracking-wider hover:bg-[#e8c97a] transition-colors flex items-center gap-1"
            >
              <Plus size={13} /> Add
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}

function SettingRow({ label, description, checked, onChange, inline }) {
  return (
    <div className={`bg-[#141414] border border-[#2a2a2a] rounded-lg p-5 flex items-center justify-between gap-4 ${inline ? 'border-0 p-0 bg-transparent' : ''}`}>
      <div>
        <p className="text-[#f5f0e8] text-sm font-medium">{label}</p>
        <p className="text-[#9a9080] text-xs mt-0.5">{description}</p>
      </div>
      <button
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none ${
          checked ? 'bg-[#c9a84c]' : 'bg-[#2a2a2a]'
        }`}
      >
        <span className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </button>
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
