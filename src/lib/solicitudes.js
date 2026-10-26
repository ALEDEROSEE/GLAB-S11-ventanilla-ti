// Datos y reglas de negocio de la ventanilla. Los componentes solo se ocupan de dibujar.

export const PRIORIDADES = [
  { valor: 'baja', etiqueta: 'Baja', pista: 'Puede esperar' },
  { valor: 'media', etiqueta: 'Media', pista: 'Molesta, pero trabajo' },
  { valor: 'alta', etiqueta: 'Alta', pista: 'Me frena por completo' },
]

export const ESTADOS = [
  { valor: 'pendiente', etiqueta: 'Pendiente' },
  { valor: 'en-proceso', etiqueta: 'En proceso' },
  { valor: 'resuelta', etiqueta: 'Resuelta' },
]

export const FILTROS = [{ valor: 'todas', etiqueta: 'Todas' }, ...ESTADOS]

// Clases completas (Tailwind no detecta nombres armados con template strings).
export const ESTILO_PRIORIDAD = {
  baja: { franja: 'bg-baja', insignia: 'bg-baja/12 text-baja ring-baja/30' },
  media: { franja: 'bg-media', insignia: 'bg-media/12 text-media ring-media/35' },
  alta: { franja: 'bg-alta', insignia: 'bg-alta/12 text-alta ring-alta/30' },
}

export const formatearNumero = (n) => String(n).padStart(3, '0')

export function contarPorEstado(solicitudes) {
  const conteo = { todas: solicitudes.length, pendiente: 0, 'en-proceso': 0, resuelta: 0 }
  for (const s of solicitudes) conteo[s.estado] += 1
  return conteo
}

export function filtrarSolicitudes(solicitudes, filtro) {
  if (filtro === 'todas') return solicitudes
  return solicitudes.filter((s) => s.estado === filtro)
}

export const MIN_TITULO = 5
export const MIN_DESCRIPCION = 15

// Devuelve un objeto { campo: mensaje }; vacio si todo esta bien.
export function validarSolicitud({ titulo, descripcion, solicitante }) {
  const errores = {}
  const t = titulo.trim()
  const d = descripcion.trim()

  if (!t) errores.titulo = 'Ponle un título a la solicitud.'
  else if (t.length < MIN_TITULO) errores.titulo = `El título es muy corto: usa al menos ${MIN_TITULO} caracteres.`

  if (!d) errores.descripcion = 'Cuéntanos qué está pasando.'
  else if (d.length < MIN_DESCRIPCION) {
    errores.descripcion = `Da un poco más de detalle (mínimo ${MIN_DESCRIPCION} caracteres, llevas ${d.length}).`
  }

  if (!solicitante.trim()) errores.solicitante = 'Indica quién hace la solicitud.'

  return errores
}
