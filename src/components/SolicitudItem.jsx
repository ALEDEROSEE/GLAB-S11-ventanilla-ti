import { Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'
import { ESTADOS, ESTILO_PRIORIDAD, PRIORIDADES, formatearNumero } from '@/lib/solicitudes'

// Una sola solicitud. No guarda estado propio: todo lo que muestra llega por props y
// todo lo que el usuario hace sube al padre llamando a onCambiarEstado / onEliminar con el id.
export default function SolicitudItem({ solicitud, onCambiarEstado, onEliminar }) {
  const { id, numero, titulo, descripcion, solicitante, prioridad, estado, hora } = solicitud
  const estilo = ESTILO_PRIORIDAD[prioridad]
  const resuelta = estado === 'resuelta'
  const etiquetaPrioridad = PRIORIDADES.find((p) => p.valor === prioridad)?.etiqueta

  return (
    <li
      data-estado={estado}
      className="relative flex overflow-hidden rounded-lg border bg-card shadow-sm animate-in fade-in slide-in-from-top-2 duration-300"
    >
      {/* talón del ticket: el color dice la prioridad */}
      <div className={cn('flex w-14 shrink-0 flex-col items-center justify-between py-3', estilo.franja)}>
        <span className="font-mono text-[11px] font-semibold tracking-widest text-white/90 [writing-mode:vertical-rl] rotate-180">
          TICKET
        </span>
        <span className="font-mono text-sm font-bold text-white">{formatearNumero(numero)}</span>
      </div>
      <div className="w-0 self-stretch border-l-2 border-dashed border-background" />

      <div className="flex min-w-0 flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className={cn('text-lg leading-snug font-semibold', resuelta && 'text-muted-foreground line-through decoration-1')}>
              {titulo}
            </h3>
            <p className="mt-0.5 font-mono text-[11px] tracking-wide text-muted-foreground">
              {solicitante} · registrada a las {hora}
            </p>
          </div>
          <Badge
            variant="outline"
            className={cn('h-6 border-transparent px-2.5 text-xs font-semibold ring-1 ring-inset', estilo.insignia)}
          >
            Prioridad {etiquetaPrioridad.toLowerCase()}
          </Badge>
        </div>

        <p className="text-[14.5px] leading-relaxed text-foreground/80">{descripcion}</p>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-dashed pt-3">
          <ToggleGroup
            type="single"
            value={estado}
            onValueChange={(nuevo) => nuevo && onCambiarEstado(id, nuevo)}
            variant="outline"
            spacing={0}
            size="sm"
            aria-label={`Estado de la solicitud ${formatearNumero(numero)}`}
          >
            {ESTADOS.map((e) => (
              <ToggleGroupItem
                key={e.valor}
                value={e.valor}
                aria-label={`Marcar la solicitud ${formatearNumero(numero)} como ${e.etiqueta.toLowerCase()}`}
                className={cn(
                  'rounded-none px-3 text-xs font-semibold first:rounded-l-md last:rounded-r-md',
                  e.valor === 'pendiente' && 'data-[state=on]:bg-foreground data-[state=on]:text-background',
                  e.valor === 'en-proceso' && 'data-[state=on]:bg-proceso data-[state=on]:text-white',
                  e.valor === 'resuelta' && 'data-[state=on]:bg-baja data-[state=on]:text-white',
                )}
              >
                {e.etiqueta}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEliminar(id)}
            aria-label={`Eliminar la solicitud ${formatearNumero(numero)}`}
            className="gap-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 />
            Eliminar
          </Button>
        </div>
      </div>

      {resuelta && (
        <span
          aria-hidden="true"
          className="sello pointer-events-none absolute right-36 bottom-3.5 hidden rounded-md border-[3px] border-baja/70 px-2.5 py-0.5 font-mono text-sm font-bold tracking-[0.2em] text-baja/80 uppercase sm:block"
        >
          Resuelta
        </span>
      )}
    </li>
  )
}
