import { Inbox, SearchX } from 'lucide-react'
import SolicitudItem from '@/components/SolicitudItem'

// Pinta la lista que le entrega el padre (ya filtrada) y reenvía hacia arriba las dos acciones.
export default function ListaSolicitudes({ solicitudes, hayRegistradas, onCambiarEstado, onEliminar }) {
  if (solicitudes.length === 0) {
    const Icono = hayRegistradas ? SearchX : Inbox
    return (
      <div className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-primary/25 bg-card/60 px-6 py-14 text-center">
        <Icono className="size-9 text-primary/50" strokeWidth={1.5} />
        <p className="font-heading text-xl font-semibold">
          {hayRegistradas ? 'Nada con ese estado' : 'La ventanilla está vacía'}
        </p>
        <p className="max-w-xs text-sm text-muted-foreground">
          {hayRegistradas
            ? 'Prueba con otro filtro o cambia el estado de alguna solicitud.'
            : 'Cuando registres la primera solicitud aparecerá aquí, con su número de ticket.'}
        </p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-3.5">
      {solicitudes.map((s) => (
        <SolicitudItem key={s.id} solicitud={s} onCambiarEstado={onCambiarEstado} onEliminar={onEliminar} />
      ))}
    </ul>
  )
}
