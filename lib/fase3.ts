import { supabaseAdmin } from '@/lib/supabase';

/**
 * Calcula representantes necesarios según la ley española (ET art. 62-66).
 * Mínimo 1 representante siempre (para que la app funcione incluso en pruebas).
 */
export function calcularRepresentantesNecesarios(numEmpleados: number): number {
  if (numEmpleados <= 0) return 1; // Mínimo 1 para pruebas
  if (numEmpleados <= 30) return 1;
  if (numEmpleados <= 49) return 3;
  if (numEmpleados <= 100) return 5;
  if (numEmpleados <= 250) return 9;
  if (numEmpleados <= 500) return 13;
  if (numEmpleados <= 750) return 17;
  if (numEmpleados <= 1000) return 21;
  return 21 + Math.ceil((numEmpleados - 1000) / 1000) * 3;
}

/**
 * Verifica y avanza automáticamente las subfases de Fase 3.
 * Llamar en cada carga del dashboard cuando fase === 3.
 *
 * Subfases:
 *  - 'candidatura': empleados deciden si presentarse o no
 *  - 'votacion': más voluntarios que necesarios → se vota
 *  - 'sorteo': menos voluntarios que necesarios → se sortea
 *  - 'confirmacion': los sorteados aceptan/rechazan (3 días)
 *
 * Returns: la subfase actual después de verificar
 */
export async function verificarSubfaseFase3(procesoId: string): Promise<string> {
  const { data: proc } = await supabaseAdmin
    .from('procesos')
    .select('id, fase, fase3_inicio, fase3_subfase, empleados_objetivo, empresa:empresas(num_empleados)')
    .eq('id', procesoId)
    .single();

  if (!proc || proc.fase !== '3') return 'candidatura';

  // Si no hay fase3_inicio, lo seteamos ahora
  if (!proc.fase3_inicio) {
    await supabaseAdmin.from('procesos')
      .update({ fase3_inicio: new Date().toISOString(), fase3_subfase: 'candidatura' })
      .eq('id', procesoId);
  }

  const subfase = proc.fase3_subfase || 'candidatura';
  const empresa = proc.empresa as unknown as { num_empleados: number } | null;
  const totalEmpleados = Number(empresa?.num_empleados) || Number(proc.empleados_objetivo) || 0;
  const necesarios = calcularRepresentantesNecesarios(totalEmpleados);

  // ═══ SUBFASE: candidatura ══════════════════════════════════════════════
  if (subfase === 'candidatura') {
    // Contar total participantes, los que han decidido (voluntario o declina), y voluntarios
    const { count: totalParticipantes } = await supabaseAdmin
      .from('participantes').select('id', { count: 'exact', head: true })
      .eq('proceso_id', procesoId);

    const { count: hanDecidido } = await supabaseAdmin
      .from('participantes').select('id', { count: 'exact', head: true })
      .eq('proceso_id', procesoId)
      .or('es_voluntario.eq.true,declina_representante.eq.true');

    const { count: voluntarios } = await supabaseAdmin
      .from('participantes').select('id', { count: 'exact', head: true })
      .eq('proceso_id', procesoId)
      .eq('es_voluntario', true);

    const todosDecididos = (hanDecidido || 0) >= (totalParticipantes || 0) && (totalParticipantes || 0) > 0;

    // Comprobar si pasaron 14 días
    const fase3Inicio = proc.fase3_inicio ? new Date(proc.fase3_inicio) : new Date();
    const diasPasados = (Date.now() - fase3Inicio.getTime()) / (1000 * 60 * 60 * 24);
    const tiempoAgotado = diasPasados >= 14;

    if (todosDecididos || tiempoAgotado) {
      const numVoluntarios = voluntarios || 0;

      if (numVoluntarios > necesarios) {
        // Más voluntarios que puestos → votación
        await supabaseAdmin.from('procesos').update({ fase3_subfase: 'votacion' }).eq('id', procesoId);
        return 'votacion';
      } else if (numVoluntarios === necesarios) {
        // Exactos → confirmar directamente y avanzar a Fase 4
        await supabaseAdmin.from('participantes')
          .update({ es_representante: true, estado_representante: 'aceptado' })
          .eq('proceso_id', procesoId)
          .eq('es_voluntario', true);
        await supabaseAdmin.from('procesos').update({ fase: '4', fase3_subfase: 'completada' }).eq('id', procesoId);
        return 'completada';
      } else {
        // Menos voluntarios → confirmar a los que hay + sorteo para el resto
        // Confirmar los voluntarios existentes
        if (numVoluntarios > 0) {
          await supabaseAdmin.from('participantes')
            .update({ es_representante: true, estado_representante: 'aceptado' })
            .eq('proceso_id', procesoId)
            .eq('es_voluntario', true);
        }
        await supabaseAdmin.from('procesos').update({ fase3_subfase: 'sorteo' }).eq('id', procesoId);
        return 'sorteo';
      }
    }

    return 'candidatura';
  }

  // ═══ SUBFASE: confirmacion (sorteo) ════════════════════════════════════
  if (subfase === 'confirmacion') {
    // Auto-rechazar a los que llevan 3 días sin responder
    const tresDiasAtras = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
    await supabaseAdmin.from('participantes')
      .update({ estado_representante: 'rechazado' })
      .eq('proceso_id', procesoId)
      .eq('estado_representante', 'pendiente')
      .lt('sorteo_notificado_at', tresDiasAtras);

    // Verificar si ya hay suficientes representantes confirmados
    const { count: confirmados } = await supabaseAdmin
      .from('participantes').select('id', { count: 'exact', head: true })
      .eq('proceso_id', procesoId)
      .eq('es_representante', true)
      .eq('estado_representante', 'aceptado');

    if ((confirmados || 0) >= necesarios) {
      // Todos cubiertos → avanzar a Fase 4
      await supabaseAdmin.from('procesos').update({ fase: '4', fase3_subfase: 'completada' }).eq('id', procesoId);
      return 'completada';
    }

    // Si hay rechazados pero no suficientes confirmados, volver a sorteo
    const { count: pendientes } = await supabaseAdmin
      .from('participantes').select('id', { count: 'exact', head: true })
      .eq('proceso_id', procesoId)
      .eq('estado_representante', 'pendiente');

    if ((pendientes || 0) === 0 && (confirmados || 0) < necesarios) {
      // Nadie pendiente y faltan → volver a sorteo
      await supabaseAdmin.from('procesos').update({ fase3_subfase: 'sorteo' }).eq('id', procesoId);
      return 'sorteo';
    }

    return 'confirmacion';
  }

  return subfase;
}
