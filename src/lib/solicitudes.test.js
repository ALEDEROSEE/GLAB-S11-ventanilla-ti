import { contarPorEstado, filtrarSolicitudes, formatearNumero, validarSolicitud } from './solicitudes'

const muestra = [
  { id: 3, estado: 'resuelta' },
  { id: 2, estado: 'en-proceso' },
  { id: 1, estado: 'pendiente' },
  { id: 4, estado: 'pendiente' },
]

describe('validarSolicitud', () => {
  it('no deja pasar título ni descripción vacíos', () => {
    const errores = validarSolicitud({ titulo: '   ', descripcion: '', solicitante: 'Ana' })
    expect(errores.titulo).toMatch(/título/i)
    expect(errores.descripcion).toMatch(/qué está pasando/i)
    expect(errores.solicitante).toBeUndefined()
  })

  it('pide un mínimo de caracteres', () => {
    const errores = validarSolicitud({ titulo: 'Hola', descripcion: 'No anda', solicitante: 'Ana' })
    expect(errores.titulo).toMatch(/al menos 5/)
    expect(errores.descripcion).toMatch(/llevas 7/)
  })

  it('devuelve un objeto vacío cuando todo está bien', () => {
    const datos = { titulo: 'Sin internet', descripcion: 'Desde las 9 no hay red en el aula 3', solicitante: 'Ana' }
    expect(validarSolicitud(datos)).toEqual({})
  })
})

describe('filtros y conteos', () => {
  it('filtrarSolicitudes respeta el estado elegido', () => {
    expect(filtrarSolicitudes(muestra, 'todas')).toHaveLength(4)
    expect(filtrarSolicitudes(muestra, 'pendiente').map((s) => s.id)).toEqual([1, 4])
    expect(filtrarSolicitudes(muestra, 'resuelta').map((s) => s.id)).toEqual([3])
  })

  it('contarPorEstado suma cada grupo', () => {
    expect(contarPorEstado(muestra)).toEqual({ todas: 4, pendiente: 2, 'en-proceso': 1, resuelta: 1 })
  })

  it('formatearNumero completa con ceros', () => {
    expect(formatearNumero(7)).toBe('007')
    expect(formatearNumero(120)).toBe('120')
  })
})
