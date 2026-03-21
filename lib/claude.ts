import Anthropic from '@anthropic-ai/sdk'
import { Propuesta } from '@/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })

export async function generarInformeTexto(
  nombreEmpresa: string,
  numEmpleados: number,
  numParticipantes: number,
  propuestas: Propuesta[]
): Promise<string> {
  const propuestasOrdenadas = propuestas
    .sort((a, b) => b.votos_count - a.votos_count)
    .slice(0, 20)

  const listaPropuestas = propuestasOrdenadas
    .map((p, i) => `${i + 1}. [${p.tipo.toUpperCase()}] "${p.titulo}" — ${p.votos_count} votos\n   ${p.descripcion}`)
    .join('\n\n')

  const prompt = `Eres un experto en relaciones laborales. Analiza las siguientes propuestas, quejas y consultas de los empleados de la empresa "${nombreEmpresa}" y genera un informe ejecutivo profesional.

DATOS DEL PROCESO:
- Empresa: ${nombreEmpresa}
- Empleados totales: ${numEmpleados}
- Participantes: ${numParticipantes} (${Math.round((numParticipantes / numEmpleados) * 100)}% de participación)

PROPUESTAS Y QUEJAS MÁS VOTADAS:
${listaPropuestas}

Genera un informe en español con la siguiente estructura:
1. RESUMEN EJECUTIVO (2-3 párrafos)
2. ANÁLISIS POR CATEGORÍAS (propuestas, quejas, consultas, sugerencias)
3. TEMAS PRIORITARIOS (los 3-5 temas más urgentes según los votos)
4. RECOMENDACIONES PARA LA EMPRESA
5. PRÓXIMOS PASOS

El informe debe ser profesional, objetivo y constructivo. No menciones nombres ni identifiques a empleados concretos.`

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  })

  return message.content[0].type === 'text' ? message.content[0].text : ''
}
