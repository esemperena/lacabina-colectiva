'use client';

import { useState } from 'react';

type Vista = 'empleado' | 'rrhh';

const fases = [
  { num: 1, label: 'Fase 1', sublabel: 'Reunir participantes' },
  { num: 2, label: 'Fase 2', sublabel: 'Propuestas' },
  { num: 3, label: 'Fase 3', sublabel: 'Representantes' },
  { num: 4, label: 'Fase 4', sublabel: 'Diálogo' },
];

/* ──────────────────────────────────────────
   EMPLOYEE DASHBOARDS (one per phase)
────────────────────────────────────────── */
function EmpleadoFase1() {
  return (
    <MockupShell empresa="Comercial Atlántico S.L." fase={1} empleadosUnidos={4} empleadosObjetivo={38}>
      <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase">Fase activa</span>
          <span className="text-base font-bold text-purple-900">Invita a más compañeros</span>
        </div>
        <p className="text-sm text-purple-700 mb-3">El proceso avanzará automáticamente cuando se unan <strong>4 compañeros más</strong> (10% de la plantilla).</p>
        <div className="bg-white border border-purple-200 rounded-lg p-3 flex items-center gap-2 mb-3">
          <span className="text-xs text-gray-500 flex-1 font-mono truncate">lacabinacolectiva.es/unirse/a8f3k2...</span>
          <button className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-semibold">Copiar</button>
        </div>
        <p className="text-xs text-purple-600">Comparte este enlace con tus compañeros. Es de un solo uso y no revela que vendrá de tu parte.</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4 text-sm text-gray-600">
        <p className="font-semibold text-gray-800 mb-2">📢 Comunicado de RRHH</p>
        <p className="italic text-gray-500">Sin comunicados todavía.</p>
      </div>
    </MockupShell>
  );
}

function EmpleadoFase2() {
  return (
    <MockupShell empresa="Comercial Atlántico S.L." fase={2} empleadosUnidos={8} empleadosObjetivo={38}>
      <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-5 mb-4">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase">Fase activa</span>
            <span className="text-base font-bold text-purple-900 ml-2">Propuestas e ideas</span>
          </div>
        </div>
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-3 flex items-center justify-between">
          <div>
            <p className="font-semibold text-teal-900 text-sm">Fase 2 en curso</p>
            <p className="text-xs text-teal-700 mt-0.5">11 días restantes</p>
            <p className="text-xs text-teal-600 mt-1">💡 Si todos pulsan <strong>"Ya no tengo más ideas"</strong> se avanza antes del plazo.</p>
          </div>
          <button className="bg-teal-600 text-white text-xs font-semibold px-3 py-2 rounded-lg whitespace-nowrap ml-3">Ya no tengo<br/>más ideas</button>
        </div>
        <div className="bg-gray-50 rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-gray-800">Enviar una idea</p>
            <span className="text-xs font-bold bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">2 / 6</span>
          </div>
          <div className="space-y-2">
            <div className="h-8 bg-white border border-gray-300 rounded-md text-xs flex items-center px-3 text-gray-400">Título de tu idea...</div>
            <div className="h-14 bg-white border border-gray-300 rounded-md text-xs flex items-start p-2 text-gray-400">Explica tu idea...</div>
            <div className="flex items-center gap-2 text-xs text-gray-600"><input type="checkbox" checked readOnly className="w-3 h-3" /><span>Enviar de forma anónima</span></div>
            <button className="w-full bg-teal-600 text-white text-xs py-2 rounded-lg font-semibold">Enviar idea</button>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Ideas enviadas (3)</p>
        {[
          { tipo: 'Queja', tipoColor: 'bg-red-100 text-red-700', titulo: 'Temperatura en las oficinas', votos: 5, votado: true },
          { tipo: 'Propuesta', tipoColor: 'bg-blue-100 text-blue-700', titulo: 'Jornada intensiva en agosto', votos: 4, votado: false },
          { tipo: 'Sugerencia', tipoColor: 'bg-green-100 text-green-700', titulo: 'Formación en herramientas digitales', votos: 2, votado: false },
        ].map(p => (
          <div key={p.titulo} className="bg-gray-50 rounded-lg border border-gray-100 p-3 flex items-center gap-3">
            <div className="flex flex-col items-center gap-0.5">
              <div className={`w-7 h-7 rounded flex items-center justify-center text-xs ${p.votado ? 'bg-teal-600 text-white' : 'border-2 border-teal-600 text-teal-600'}`}>▲</div>
              <span className="text-sm font-bold text-teal-600">{p.votos}</span>
            </div>
            <div>
              <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${p.tipoColor} mr-1`}>{p.tipo}</span>
              <span className="text-xs font-semibold text-gray-900">{p.titulo}</span>
            </div>
          </div>
        ))}
      </div>
    </MockupShell>
  );
}

function EmpleadoFase3() {
  const voluntarios = 2;
  const necesarios = 3;
  const pct = Math.round((voluntarios / necesarios) * 100);
  const r = 40;
  const circ = 2 * Math.PI * r;
  const dash = circ - (pct / 100) * circ;
  return (
    <MockupShell empresa="Comercial Atlántico S.L." fase={3} empleadosUnidos={8} empleadosObjetivo={38}>
      <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase">Fase activa</span>
          <span className="text-base font-bold text-purple-900">Selección de Representantes</span>
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1">
            <p className="text-sm text-gray-700 mb-3">Hay <strong>2 semanas</strong> para presentarse como voluntario. Los candidatos serán votados por el resto de participantes.</p>
            <button className="bg-purple-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg">🙋 Quiero ser Representante</button>
          </div>
          <div className="flex flex-col items-center">
            <svg width="100" height="100" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r={r} fill="none" stroke="#e9d5ff" strokeWidth="12" />
              <circle cx="50" cy="50" r={r} fill="none" stroke="#9333ea" strokeWidth="12"
                strokeDasharray={circ} strokeDashoffset={dash} strokeLinecap="round" transform="rotate(-90 50 50)" />
              <text x="50" y="46" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#7e22ce">{voluntarios}</text>
              <text x="50" y="62" textAnchor="middle" fontSize="10" fill="#a855f7">de {necesarios}</text>
            </svg>
            <p className="text-xs text-center text-gray-600 font-medium mt-1">Voluntarios presentados</p>
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-sm font-semibold text-gray-800 mb-2">Propuestas de la Fase 2</p>
        {[
          { tipo: 'Queja', tipoColor: 'bg-red-100 text-red-700', titulo: 'Temperatura en las oficinas', votos: 5 },
          { tipo: 'Propuesta', tipoColor: 'bg-blue-100 text-blue-700', titulo: 'Jornada intensiva en agosto', votos: 4 },
        ].map(p => (
          <div key={p.titulo} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
            <span className="text-sm font-bold text-teal-600 w-5 text-center">{p.votos}</span>
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${p.tipoColor}`}>{p.tipo}</span>
            <span className="text-xs text-gray-800">{p.titulo}</span>
          </div>
        ))}
      </div>
    </MockupShell>
  );
}

function EmpleadoFase4() {
  return (
    <MockupShell empresa="Comercial Atlántico S.L." fase={4} empleadosUnidos={8} empleadosObjetivo={38}>
      <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase">Fase activa</span>
          <span className="text-base font-bold text-purple-900">Fase de Diálogo</span>
        </div>
        <p className="text-sm text-purple-700">Los representantes elegidos están dialogando con la dirección de la empresa. Aquí aparecerán los acuerdos y resultados alcanzados.</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
        <p className="text-sm font-semibold text-gray-800 mb-2">📢 Comunicado de RRHH</p>
        <div className="bg-orange-50 border-l-4 border-orange-400 p-3 rounded text-sm text-gray-700">
          Hemos recibido las propuestas de los representantes. La primera reunión será el próximo martes 22 de enero a las 10:00h.
        </div>
        <p className="text-xs text-gray-400 mt-2">Hace 2 días</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-sm font-semibold text-gray-800 mb-2">Propuestas en negociación</p>
        {[
          { titulo: 'Temperatura en las oficinas', votos: 5, estado: 'En negociación', estadoColor: 'bg-yellow-100 text-yellow-700' },
          { titulo: 'Jornada intensiva en agosto', votos: 4, estado: 'Acordado ✓', estadoColor: 'bg-green-100 text-green-700' },
        ].map(p => (
          <div key={p.titulo} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
            <span className="text-sm font-bold text-teal-600 w-5 text-center">{p.votos}</span>
            <span className="text-xs text-gray-800 flex-1">{p.titulo}</span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${p.estadoColor}`}>{p.estado}</span>
          </div>
        ))}
      </div>
    </MockupShell>
  );
}

/* ──────────────────────────────────────────
   RRHH DASHBOARDS (one per phase)
────────────────────────────────────────── */
function RrhhFase1() {
  return (
    <RrhhMockupShell empresa="Comercial Atlántico S.L." fase={1} empleadosUnidos={4} empleadosObjetivo={38}>
      <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase">Fase activa</span>
          <span className="text-base font-bold text-purple-900">📨 Los empleados están uniéndose</span>
        </div>
        <p className="text-sm text-purple-700">El proceso avanzará automáticamente a la Fase 2 cuando se alcance el umbral de participación. Podéis facilitar el proceso compartiendo el enlace de invitación con toda la plantilla.</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">Publicar comunicado para todos los participantes</p>
        <textarea className="w-full h-16 border border-gray-300 rounded-lg text-xs p-2 text-gray-400 resize-none" placeholder="Escribe un mensaje para los empleados..." readOnly />
        <button className="mt-2 bg-teal-600 text-white text-xs font-semibold px-4 py-2 rounded-lg">Publicar</button>
      </div>
    </RrhhMockupShell>
  );
}

function RrhhFase2() {
  return (
    <RrhhMockupShell empresa="Comercial Atlántico S.L." fase={2} empleadosUnidos={8} empleadosObjetivo={38}>
      <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase">Fase activa</span>
          <span className="text-base font-bold text-purple-900">💡 Los empleados están enviando propuestas</span>
        </div>
        <p className="text-sm text-purple-700">Los empleados están enviando y votando ideas durante un máximo de 2 semanas. <strong>No podéis ver las propuestas ni quién las envía</strong> hasta que la fase concluya.</p>
        <div className="mt-3 grid grid-cols-2 gap-2 text-center">
          <div className="bg-white rounded-lg border border-purple-100 p-2">
            <p className="text-xl font-bold text-purple-700">3</p>
            <p className="text-xs text-gray-500">ideas enviadas</p>
          </div>
          <div className="bg-white rounded-lg border border-purple-100 p-2">
            <p className="text-xl font-bold text-purple-700">2 / 8</p>
            <p className="text-xs text-gray-500">confirmaron "sin más ideas"</p>
          </div>
        </div>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">Publicar comunicado</p>
        <div className="h-16 bg-gray-50 border border-gray-200 rounded-lg text-xs p-2 text-gray-400">Escribe un mensaje para los empleados...</div>
        <button className="mt-2 bg-teal-600 text-white text-xs font-semibold px-4 py-2 rounded-lg">Publicar</button>
      </div>
    </RrhhMockupShell>
  );
}

function RrhhFase3() {
  return (
    <RrhhMockupShell empresa="Comercial Atlántico S.L." fase={3} empleadosUnidos={8} empleadosObjetivo={38}>
      <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase">Fase activa</span>
          <span className="text-base font-bold text-purple-900">🙋 Elección de representantes en curso</span>
        </div>
        <p className="text-sm text-purple-700 mb-3">Los empleados se están presentando como candidatos. Se necesitan <strong>3 representantes</strong> para una empresa de 38 empleados según el Estatuto de los Trabajadores.</p>
        <div className="bg-white rounded-lg border border-purple-100 p-3 text-center">
          <p className="text-2xl font-bold text-purple-700">2 <span className="text-sm font-normal text-gray-500">de 3</span></p>
          <p className="text-xs text-gray-500 mt-0.5">voluntarios presentados (identidades anónimas)</p>
        </div>
      </div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
        <p className="font-semibold mb-1">⚠️ Información para RRHH</p>
        <p>Las identidades de los voluntarios son anónimas hasta que finalice esta fase. Recibiréis una notificación cuando los representantes estén elegidos.</p>
      </div>
    </RrhhMockupShell>
  );
}

function RrhhFase4() {
  return (
    <RrhhMockupShell empresa="Comercial Atlántico S.L." fase={4} empleadosUnidos={8} empleadosObjetivo={38}>
      <div className="bg-purple-50 border-2 border-purple-300 rounded-xl p-5 mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full uppercase">Fase activa</span>
          <span className="text-base font-bold text-purple-900">🤝 Fase de Diálogo</span>
        </div>
        <p className="text-sm text-purple-700">Los representantes elegidos están en contacto con la dirección. A continuación podéis ver las propuestas priorizadas por los empleados.</p>
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-3">
        <p className="text-sm font-semibold text-gray-800 mb-2">Propuestas priorizadas por los empleados</p>
        {[
          { titulo: 'Temperatura en las oficinas', votos: 5, tipo: 'Queja', tipoColor: 'bg-red-100 text-red-700' },
          { titulo: 'Jornada intensiva en agosto', votos: 4, tipo: 'Propuesta', tipoColor: 'bg-blue-100 text-blue-700' },
          { titulo: 'Formación en herramientas digitales', votos: 2, tipo: 'Sugerencia', tipoColor: 'bg-green-100 text-green-700' },
        ].map((p, i) => (
          <div key={p.titulo} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
            <span className="text-xs font-bold text-gray-400 w-4">#{i + 1}</span>
            <span className="text-sm font-bold text-teal-600 w-5">{p.votos}</span>
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${p.tipoColor}`}>{p.tipo}</span>
            <span className="text-xs text-gray-800">{p.titulo}</span>
          </div>
        ))}
      </div>
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <p className="text-sm font-semibold text-gray-700 mb-2">Publicar resultado de negociación</p>
        <div className="h-12 bg-gray-50 border border-gray-200 rounded-lg text-xs p-2 text-gray-400">Escribe el acuerdo alcanzado...</div>
        <button className="mt-2 bg-teal-600 text-white text-xs font-semibold px-4 py-2 rounded-lg">Publicar</button>
      </div>
    </RrhhMockupShell>
  );
}

/* ──────────────────────────────────────────
   SHARED SHELL COMPONENTS
────────────────────────────────────────── */
function Timeline({ fase }: { fase: number }) {
  const labels = ['Participantes', 'Propuestas', 'Representantes', 'Diálogo'];
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1 flex items-center">
          {[1, 2, 3, 4].map((f, i) => (
            <div key={f} className="flex items-center flex-1 last:flex-none">
              <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                ${f < fase ? 'bg-teal-600 text-white' : f === fase ? 'bg-teal-600 text-white ring-2 ring-teal-200 ring-offset-1' : 'bg-gray-100 text-gray-400'}`}>
                {f < fase ? '✓' : f}
              </div>
              {i < 3 && <div className={`flex-1 h-0.5 mx-1 ${f < fase ? 'bg-teal-600' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>
      </div>
      <div className="flex justify-between px-0">
        {labels.map((l, i) => (
          <span key={l} className={`text-xs font-medium ${i + 1 === fase ? 'text-teal-700' : 'text-gray-400'} w-1/4 text-center`}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function ParticipacionBar({ unidos, objetivo }: { unidos: number; objetivo: number }) {
  const pct = Math.min(100, Math.round((unidos / objetivo) * 100));
  return (
    <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
      <span className="whitespace-nowrap">Participación:</span>
      <div className="flex-1 bg-gray-100 rounded-full h-1.5">
        <div className="bg-teal-500 h-1.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
      </div>
      <span className="whitespace-nowrap font-medium text-gray-700">{unidos}/{objetivo}</span>
    </div>
  );
}

function MockupShell({ empresa, fase, empleadosUnidos, empleadosObjetivo, children }: {
  empresa: string; fase: number; empleadosUnidos: number; empleadosObjetivo: number; children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 rounded-2xl border-2 border-gray-200 overflow-hidden">
      {/* Browser chrome */}
      <div className="bg-gray-200 px-4 py-2 flex items-center gap-2">
        <div className="w-2.5 h-2.5 bg-red-400 rounded-full" />
        <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />
        <div className="w-2.5 h-2.5 bg-green-400 rounded-full" />
        <div className="flex-1 bg-white rounded text-xs text-gray-500 px-3 py-1 mx-2 truncate">lacabinacolectiva.es/dashboard/proceso</div>
      </div>
      <div className="p-4 max-h-[520px] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-gray-500">Dashboard empleado</p>
            <p className="text-base font-bold text-gray-900">{empresa}</p>
          </div>
          <div className="text-right">
            <span className="text-xs bg-teal-100 text-teal-800 font-semibold px-2 py-0.5 rounded-full">Fase {fase}</span>
          </div>
        </div>
        <ParticipacionBar unidos={empleadosUnidos} objetivo={empleadosObjetivo} />
        <Timeline fase={fase} />
        {children}
      </div>
    </div>
  );
}

function RrhhMockupShell({ empresa, fase, empleadosUnidos, empleadosObjetivo, children }: {
  empresa: string; fase: number; empleadosUnidos: number; empleadosObjetivo: number; children: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 rounded-2xl border-2 border-gray-200 overflow-hidden">
      <div className="bg-gray-200 px-4 py-2 flex items-center gap-2">
        <div className="w-2.5 h-2.5 bg-red-400 rounded-full" />
        <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />
        <div className="w-2.5 h-2.5 bg-green-400 rounded-full" />
        <div className="flex-1 bg-white rounded text-xs text-gray-500 px-3 py-1 mx-2 truncate">lacabinacolectiva.es/rrhh/token-privado</div>
      </div>
      <div className="p-4 max-h-[520px] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-xs text-gray-500">Panel de RRHH · Solo lectura</p>
            <p className="text-base font-bold text-gray-900">{empresa}</p>
          </div>
          <span className="text-xs bg-orange-100 text-orange-700 font-semibold px-2 py-0.5 rounded-full">Fase {fase}</span>
        </div>
        <ParticipacionBar unidos={empleadosUnidos} objetivo={empleadosObjetivo} />
        <Timeline fase={fase} />
        {children}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────
   MAIN CAROUSEL COMPONENT
────────────────────────────────────────── */
const empleadoFases = [EmpleadoFase1, EmpleadoFase2, EmpleadoFase3, EmpleadoFase4];
const rrhhFases = [RrhhFase1, RrhhFase2, RrhhFase3, RrhhFase4];

export default function DashboardCarousel() {
  const [vista, setVista] = useState<Vista>('empleado');
  const [faseIdx, setFaseIdx] = useState(0);

  const EmpleadoView = empleadoFases[faseIdx];
  const RrhhView = rrhhFases[faseIdx];

  return (
    <div className="bg-gray-900 rounded-2xl p-6 sm:p-8">
      {/* Vista toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h3 className="text-white text-lg font-bold">Vista previa de los dashboards</h3>
        <div className="flex bg-gray-800 p-1 rounded-xl gap-1 self-start sm:self-auto">
          <button
            onClick={() => setVista('empleado')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${vista === 'empleado' ? 'bg-teal-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            👤 Empleado
          </button>
          <button
            onClick={() => setVista('rrhh')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${vista === 'rrhh' ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            🏢 RRHH
          </button>
        </div>
      </div>

      {/* Phase selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {fases.map((f, i) => (
          <button
            key={f.num}
            onClick={() => setFaseIdx(i)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors border ${
              faseIdx === i
                ? 'bg-white text-gray-900 border-white'
                : 'bg-gray-800 text-gray-400 border-gray-700 hover:border-gray-500 hover:text-gray-200'
            }`}
          >
            <span className="font-bold">{f.label}</span>
            <span className={`block text-xs font-normal ${faseIdx === i ? 'text-gray-600' : 'text-gray-500'}`}>{f.sublabel}</span>
          </button>
        ))}
      </div>

      {/* Dashboard mockup */}
      <div className="transition-all">
        {vista === 'empleado' ? <EmpleadoView /> : <RrhhView />}
      </div>

      <p className="text-gray-500 text-xs text-center mt-4">
        Datos ficticios con fines ilustrativos · Empresa: Comercial Atlántico S.L. · 38 empleados
      </p>
    </div>
  );
}
