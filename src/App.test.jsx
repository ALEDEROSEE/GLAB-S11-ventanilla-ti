import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '@/App'

async function registrar(user, { titulo, descripcion, solicitante, prioridad = 'Media' }) {
  await user.type(screen.getByLabelText('Título'), titulo)
  await user.type(screen.getByLabelText('Descripción'), descripcion)
  await user.type(screen.getByLabelText('Solicitante'), solicitante)
  await user.click(screen.getByLabelText(prioridad))
  await user.click(screen.getByRole('button', { name: /registrar solicitud/i }))
}

const CASOS = [
  { titulo: 'Impresora del 2.º piso', descripcion: 'Sale Error 79 y la cola se traba', solicitante: 'Marcela Quispe', prioridad: 'Alta' },
  { titulo: 'No entra la VPN', descripcion: 'El autenticador rechaza el código siempre', solicitante: 'Diego Paredes' },
  { titulo: 'Instalar VS Code', descripcion: 'Hace falta en las 20 PCs del laboratorio B', solicitante: 'Rosa Huamán', prioridad: 'Baja' },
]

async function conTresSolicitudes() {
  const user = userEvent.setup({ delay: null })
  render(<App />)
  for (const caso of CASOS) await registrar(user, caso)
  return user
}

const titulosVisibles = () => screen.queryAllByRole('heading', { level: 3 }).map((h) => h.textContent)

describe('Ventanilla TI', () => {
  it('arranca vacía', () => {
    render(<App />)
    expect(screen.getByText('La ventanilla está vacía')).toBeInTheDocument()
  })

  it('no registra si faltan datos y muestra los mensajes', async () => {
    const user = userEvent.setup({ delay: null })
    render(<App />)
    await user.click(screen.getByRole('button', { name: /registrar solicitud/i }))

    expect(screen.getByText('Ponle un título a la solicitud.')).toBeInTheDocument()
    expect(screen.getByText('Cuéntanos qué está pasando.')).toBeInTheDocument()
    expect(screen.getByText('Indica quién hace la solicitud.')).toBeInTheDocument()
    expect(screen.getByText('La ventanilla está vacía')).toBeInTheDocument()
    expect(screen.getByLabelText('Título')).toHaveFocus()
  })

  it('el error de un campo desaparece al escribir en él', async () => {
    const user = userEvent.setup({ delay: null })
    render(<App />)
    await user.click(screen.getByRole('button', { name: /registrar solicitud/i }))
    expect(screen.getByText('Ponle un título a la solicitud.')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Título'), 'Sin red')
    expect(screen.queryByText('Ponle un título a la solicitud.')).not.toBeInTheDocument()
  })

  it('registra una solicitud nueva sin recargar y limpia el formulario', async () => {
    const user = userEvent.setup({ delay: null })
    render(<App />)
    await registrar(user, CASOS[0])

    expect(titulosVisibles()).toEqual(['Impresora del 2.º piso'])
    expect(screen.getByText('Solicitud 001 registrada')).toBeInTheDocument()
    expect(screen.getByLabelText('Título')).toHaveValue('')
    expect(screen.getByText(/Prioridad alta/)).toBeInTheDocument()
  })

  it('la solicitud más nueva aparece arriba y los números no se repiten', async () => {
    await conTresSolicitudes()
    expect(titulosVisibles()).toEqual(['Instalar VS Code', 'No entra la VPN', 'Impresora del 2.º piso'])
    expect(screen.getByText('003')).toBeInTheDocument()
    expect(screen.getByText('001')).toBeInTheDocument()
  })

  it('cambia el estado de una solicitud y se actualizan los contadores', async () => {
    const user = await conTresSolicitudes()
    await user.click(screen.getByRole('radio', { name: /solicitud 002 como en proceso/i }))
    await user.click(screen.getByRole('radio', { name: /solicitud 001 como resuelta/i }))

    expect(screen.getByRole('radio', { name: /solicitud 002 como en proceso/i })).toBeChecked()
    expect(screen.getByRole('radio', { name: /ver pendiente \(1\)/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /ver en proceso \(1\)/i })).toBeInTheDocument()
    expect(screen.getByRole('radio', { name: /ver resuelta \(1\)/i })).toBeInTheDocument()
  })

  it('elimina exactamente la solicitud elegida', async () => {
    const user = await conTresSolicitudes()
    await user.click(screen.getByRole('button', { name: /eliminar la solicitud 002/i }))
    expect(titulosVisibles()).toEqual(['Instalar VS Code', 'Impresora del 2.º piso'])
  })

  it('hacer click otra vez en el filtro activo no lo desmarca', async () => {
    const user = await conTresSolicitudes()
    await user.click(screen.getByRole('radio', { name: /ver pendiente \(3\)/i }))
    await user.click(screen.getByRole('radio', { name: /ver pendiente \(3\)/i }))
    expect(screen.getByRole('radio', { name: /ver pendiente \(3\)/i })).toBeChecked()
    expect(titulosVisibles()).toHaveLength(3)
  })

  it('el filtro deja ver solo las solicitudes de ese estado', async () => {
    const user = await conTresSolicitudes()
    await user.click(screen.getByRole('radio', { name: /solicitud 002 como en proceso/i }))
    await user.click(screen.getByRole('radio', { name: /ver en proceso \(1\)/i }))
    expect(titulosVisibles()).toEqual(['No entra la VPN'])

    await user.click(screen.getByRole('radio', { name: /ver resuelta \(0\)/i }))
    expect(screen.getByText('Nada con ese estado')).toBeInTheDocument()
  })

  it('eliminar dentro de un filtro borra la solicitud correcta (el fallo de la guía con index)', async () => {
    const user = await conTresSolicitudes()
    // 002 pasa a resuelta; con el filtro "Pendiente" quedan 003 y 001
    await user.click(screen.getByRole('radio', { name: /solicitud 002 como resuelta/i }))
    await user.click(screen.getByRole('radio', { name: /ver pendiente \(2\)/i }))
    expect(titulosVisibles()).toEqual(['Instalar VS Code', 'Impresora del 2.º piso'])

    // se elimina la 2.ª de la vista filtrada: la 001. En la lista completa esa posición era la 002
    const tarjeta = screen.getByText('Impresora del 2.º piso').closest('li')
    await user.click(within(tarjeta).getByRole('button', { name: /eliminar/i }))

    await user.click(screen.getByRole('radio', { name: /ver todas/i }))
    expect(titulosVisibles()).toEqual(['Instalar VS Code', 'No entra la VPN'])
  })
})
