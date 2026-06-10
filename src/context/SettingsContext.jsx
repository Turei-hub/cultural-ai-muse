import { createContext, useContext, useState } from 'react'

const DEFAULTS = {
  showNewsletter: true,
  showSocialStats: true,
  maintenanceBanner: false,
  maintenanceMessage: 'We\'ll be back shortly — Kia kaha! 🌿',
  marqueeItems: [
    'AI-Generated Māori Art',
    'Digital Downloads',
    'Archival Prints',
    'Portraits of Atua',
    'Aotearoa Landscapes',
    'Whakataukī Quotes',
    'Wahine Toa',
    'Whānau & Community',
    'Kia ora — Welcome',
  ],
}

function load() {
  try {
    const saved = localStorage.getItem('cam_settings')
    return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS
  } catch {
    return DEFAULTS
  }
}

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(load)

  function update(key, value) {
    setSettings(prev => {
      const next = { ...prev, [key]: value }
      localStorage.setItem('cam_settings', JSON.stringify(next))
      return next
    })
  }

  return (
    <SettingsContext.Provider value={{ settings, update }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  return useContext(SettingsContext)
}
