'use client'
import { useState, useEffect } from 'react'

declare global {
  interface Window {
    dataLayer: Record<string, unknown>[]
  }
}

function loadGTM() {
  if (typeof window === 'undefined') return
  if (document.getElementById('gtm-script')) return
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' })
  const script = document.createElement('script')
  script.id = 'gtm-script'
  script.async = true
  script.src = 'https://www.googletagmanager.com/gtm.js?id=GTM-5FZRQQT6'
  document.head.appendChild(script)
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent')
    if (!consent) {
      setVisible(true)
    } else if (consent === 'accepted') {
      loadGTM()
    }
  }, [])

  function accept() {
    localStorage.setItem('cookie_consent', 'accepted')
    loadGTM()
    setVisible(false)
  }

  function reject() {
    localStorage.setItem('cookie_consent', 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <div className="max-w-3xl mx-auto bg-white border border-gray-200 rounded-2xl shadow-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm text-gray-700 leading-relaxed">
            Usamos cookies analíticas (Google Analytics) para entender cómo se usa la web y mejorarla.
            No usamos cookies publicitarias. Consulta nuestra{' '}
            <a href="/privacidad" className="text-teal-600 underline hover:text-teal-700">
              Política de Privacidad
            </a>
            .
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={reject}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Rechazar
          </button>
          <button
            onClick={accept}
            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}
