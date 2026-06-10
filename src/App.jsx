import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext'
import { SettingsProvider, useSettings } from './context/SettingsContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Cart from './pages/Cart'
import Admin from './pages/Admin'
import AdminLogin from './pages/AdminLogin'
import './index.css'

function MaintenanceBanner() {
  const { settings } = useSettings()
  if (!settings.maintenanceBanner) return null
  return (
    <div className="w-full bg-[#c9a84c] text-[#0a0a0a] text-xs font-semibold text-center py-2 px-4 tracking-wide">
      {settings.maintenanceMessage}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <AuthProvider>
          <CartProvider>
            <Routes>
              {/* Admin routes — no Navbar/Footer */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={
                <ProtectedRoute>
                  <Admin />
                </ProtectedRoute>
              } />

              {/* Public routes — with Navbar/Footer */}
              <Route path="*" element={
                <div className="min-h-screen flex flex-col bg-[#0a0a0a]">
                  <MaintenanceBanner />
                  <Navbar />
                  <main className="flex-1">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/shop" element={<Shop />} />
                      <Route path="/product/:id" element={<ProductDetail />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/cart" element={<Cart />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              } />
            </Routes>
          </CartProvider>
        </AuthProvider>
      </SettingsProvider>
    </BrowserRouter>
  )
}
