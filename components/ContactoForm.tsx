'use client';

import { useState } from 'react';

export default function ContactoForm({ compact = false }: { compact?: boolean }) {
  const [formData, setFormData] = useState({ email: '', asunto: '', mensaje: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email || !formData.asunto || !formData.mensaje) {
      setError('Todos los campos son obligatorios.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/contacto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Error al enviar');
      setSuccess(true);
      setFormData({ email: '', asunto: '', mensaje: '' });
    } catch {
      setError('No se pudo enviar el mensaje. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
        <div className="text-4xl mb-3">✓</div>
        <p className="font-semibold text-green-800 text-lg mb-1">Mensaje enviado</p>
        <p className="text-green-700 text-sm">Nos pondremos en contacto contigo lo antes posible.</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-4 text-sm text-green-600 underline hover:text-green-800"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className={compact ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : ''}>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">
            Tu email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-gray-900 bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1">
            Asunto <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="asunto"
            value={formData.asunto}
            onChange={handleChange}
            placeholder="¿En qué podemos ayudarte?"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-gray-900 bg-white"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-1">
          Mensaje <span className="text-red-500">*</span>
        </label>
        <textarea
          name="mensaje"
          value={formData.mensaje}
          onChange={handleChange}
          rows={compact ? 4 : 6}
          placeholder="Escribe tu mensaje aquí..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 text-gray-900 bg-white resize-none"
        />
      </div>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-6 py-3 bg-teal-600 text-white rounded-lg font-semibold hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Enviando...' : 'Enviar mensaje'}
      </button>
    </form>
  );
}
