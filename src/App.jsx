import { useEffect, useRef, useState } from 'react'
import { CheckCircle2 } from 'lucide-react'
import SolicitudForm from '@/components/SolicitudForm'
import ListaSolicitudes from '@/components/ListaSolicitudes'
import FiltrosSolicitudes from '@/components/FiltrosSolicitudes'
import { contarPorEstado, filtrarSolicitudes, formatearNumero } from '@/lib/solicitudes'

// App es el único componente que guarda los datos. Los demás reciben valores y funciones por props:
//   SolicitudForm       <- onAgregar
//   FiltrosSolicitudes  <- filtro, conteos, onFiltrar
//   ListaSolicitudes    <- solicitudes (ya filtradas), hayRegistradas, onCambiarEstado, onEliminar
//   SolicitudItem       <- solicitud, onCambiarEstado, onEliminar   (a través de la lista)
export default function App() {
  const [solicitudes, setSolicitudes] = useState([])
  const [filtro, setFiltro] = useState('todas')
  const [aviso, setAviso] = useState(null)
  const siguienteNumero = useRef(1)

  useEffect(() => {
    if (!aviso) return
    const t = setTimeout(() => setAviso(null), 3500)
    return () => clearTimeout(t)
  }, [aviso])

  const agregarSolicitud = (datos) => {
    const numero = siguienteNumero.current++
    const hora = new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit', hour12: false })
    // el id es el número de ticket: no cambia aunque la lista se filtre o se borre algo
    setSolicitudes((previas) => [{ ...datos, id: numero, numero, estado: 'pendiente', hora }, ...previas])
    setAviso(`Solicitud ${formatearNumero(numero)} registrada`)
  }

  const cambiarEstado = (id, estado) => {
    setSolicitudes((previas) => previas.map((s) => (s.id === id ? { ...s, estado } : s)))
  }

  const eliminarSolicitud = (id) => {
    setSolicitudes((previas) => previas.filter((s) => s.id !== id))
  }

  const conteos = contarPorEstado(solicitudes)
  const visibles = filtrarSolicitudes(solicitudes, filtro)

  return (
    <div className="min-h-screen pb-16">
      <header className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-9 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="font-mono text-[11px] font-medium tracking-[0.3em] text-[#f2c9a5] uppercase">
              Soporte técnico interno
            </p>
            <h1 className="mt-2 text-5xl leading-none font-semibold tracking-tight sm:text-6xl">
              Ventanilla <em className="font-normal text-[#ff8a4c]">TI</em>
            </h1>
            <p className="mt-3 max-w-md text-[15px] text-primary-foreground/80">
              Cuéntanos qué se malogró. Lo anotamos con su número de ticket, lo atendemos y lo cerramos.
            </p>
          </div>
          <dl className="flex gap-6 font-mono">
            <div>
              <dt className="text-[11px] tracking-widest text-primary-foreground/60 uppercase">Abiertas</dt>
              <dd className="text-3xl font-bold">{conteos.pendiente + conteos['en-proceso']}</dd>
            </div>
            <div>
              <dt className="text-[11px] tracking-widest text-primary-foreground/60 uppercase">Cerradas</dt>
              <dd className="text-3xl font-bold">{conteos.resuelta}</dd>
            </div>
          </dl>
        </div>
        {/* borde de ticket arrancado */}
        <div
          aria-hidden="true"
          className="h-3 bg-[radial-gradient(circle_at_8px_0,var(--background)_6px,transparent_6.5px)] bg-[length:16px_12px] bg-repeat-x"
        />
      </header>

      <main className="mx-auto mt-8 grid max-w-6xl gap-8 px-5 lg:grid-cols-[380px_1fr] lg:items-start">
        <div className="lg:sticky lg:top-6">
          <SolicitudForm onAgregar={agregarSolicitud} />
        </div>

        <section aria-label="Solicitudes registradas" className="flex flex-col gap-4">
          <FiltrosSolicitudes filtro={filtro} conteos={conteos} onFiltrar={setFiltro} />

          <p role="status" aria-live="polite" className="min-h-6 text-sm font-medium text-primary">
            {aviso && (
              <span className="inline-flex items-center gap-1.5 animate-in fade-in slide-in-from-left-2">
                <CheckCircle2 className="size-4" />
                {aviso}
              </span>
            )}
          </p>

          <ListaSolicitudes
            solicitudes={visibles}
            hayRegistradas={solicitudes.length > 0}
            onCambiarEstado={cambiarEstado}
            onEliminar={eliminarSolicitud}
          />
        </section>
      </main>
    </div>
  )
}
