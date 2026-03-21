'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/admin/magic-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setSuccess(true)
        setEmail('')
      } else {
        setError('Ocurrió un error. Intenta nuevamente.')
      }
    } catch (err) {
      setError('Ocurrió un error. Intenta nuevamente.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">La Cabina Colectiva</h1>
          </div>

          <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">
            Acceso de Administrador
          </h2>
          <p className="text-sm text-gray-500 text-center mb-8">
            Introduce tu email para recibir un enlace de acceso
          </p>

          {success ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-green-800 text-sm">
                Te hemos enviado un enlace de acceso a <strong>{email}</strong>. Revisa tu bandeja de entrada.
              </p>
            </div>
          ) : null}

          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || success}
                placeholder="admin@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={loading || success || !email}
              className="w-full bg-teal-600 text-white font-semibold py-2 rounded-lg hover:bg-teal-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Enviar enlace de acceso'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <Link
              href="/"
              className="text-sm text-gray-500 hover:text-teal-600 flex items-center justify-center gap-1"
            >
              ← Volver a la web
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
