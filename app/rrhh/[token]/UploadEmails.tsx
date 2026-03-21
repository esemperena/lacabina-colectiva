'use client';

import { useState } from 'react';

export default function UploadEmails({ token }: { token: string }) {
  const [open, setOpen] = useState(false);
  const [emails, setEmails] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/rrhh/empleados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, emails }),
      });
      const data = await res.json();
      if (res.ok) {
        setResult({ ok: true, message: `✅ ${data.enviados} invitaciones enviadas correctamente.` });
        setEmails('');
      } else {
        setResult({ ok: false, message: data.error || 'Error al procesar los emails.' });
      }
    } catch {
      setResult({ ok: false, message: 'Error de conexión. Inténtalo de nuevo.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-8 mb-8">
      {/* Header acción pendiente */}
      <div className="flex items-start gap-4 mb-6">
        <div className="w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-white font-bold text-lg">!</span>
        </div>
        <div>
          <span className="text-xs font-bold uppercase tracking-wide text-amber-700 mb-1 block">Acción pendiente</span>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Proporciona el listado de empleados</h3>
          <p className="text-gray-700 leading-relaxed mb-4">
            Para que el proceso sea lo más ágil y representativo posible, necesitamos que compartas los correos electrónicos de toda la plantilla. La plataforma enviará automáticamente una invitación personalizada a cada persona para que pueda unirse de forma voluntaria y anónima.
          </p>

          {/* Privacidad */}
          <div className="bg-white border border-amber-200 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-900 mb-2">🔒 Privacidad garantizada en todo momento</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>• Los correos se convierten en un código irreversible (hash) nada más recibirlos. <strong>Nunca se almacenan en texto claro.</strong></li>
              <li>• La empresa no puede saber quién ha participado, quién ha votado qué ni quién ha enviado propuestas.</li>
              <li>• Los empleados que decidan no participar simplemente ignoran el email. No hay consecuencias.</li>
              <li>• Todos los datos se eliminan de los servidores al finalizar el proceso.</li>
            </ul>
          </div>

          {/* Win-win */}
          <div className="bg-white border border-teal-200 rounded-lg p-4 mb-6">
            <h4 className="font-semibold text-gray-900 mb-2">🤝 Un proceso transparente beneficia a todos</h4>
            <p className="text-sm text-gray-700 leading-relaxed">
              La colaboración de RRHH no es solo un gesto — es una inversión. Las empresas donde los empleados se sienten escuchados registran <strong>menos absentismo, mayor retención de talento y mejor clima laboral</strong>. Compartir el listado completo de empleados garantiza que el proceso sea representativo, legítimo y reconocido por ambas partes. El objetivo final es el mismo: una empresa donde la comunicación fluye y todos ganan.
            </p>
          </div>

          {/* Botón / formulario */}
          {!open ? (
            <button
              onClick={() => setOpen(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Proporcionar listado de empleados
            </button>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white border border-amber-200 rounded-lg p-6">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Correos electrónicos de empleados
              </label>
              <p className="text-xs text-gray-500 mb-3">
                Pega un email por línea, o separados por comas. No importa el formato.
              </p>
              <textarea
                value={emails}
                onChange={e => setEmails(e.target.value)}
                rows={8}
                placeholder={'empleado1@empresa.com\nempleado2@empresa.com\nempleado3@empresa.com'}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4 resize-y"
                required
              />
              {result && (
                <div className={`p-3 rounded-lg text-sm mb-4 ${result.ok ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
                  {result.message}
                </div>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={loading || !emails.trim()}
                  className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
                >
                  {loading ? 'Enviando invitaciones…' : 'Enviar invitaciones'}
                </button>
                <button
                  type="button"
                  onClick={() => { setOpen(false); setResult(null); }}
                  className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg border border-gray-300"
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
