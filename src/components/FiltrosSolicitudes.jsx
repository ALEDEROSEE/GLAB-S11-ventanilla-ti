import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { FILTROS } from '@/lib/solicitudes'

// Hermano del formulario: no sabe nada de él. Solo avisa al padre qué criterio eligió el usuario
// y muestra cuántas solicitudes hay por estado (el padre le pasa los conteos ya calculados).
export default function FiltrosSolicitudes({ filtro, conteos, onFiltrar }) {
  return (
    <ToggleGroup
      type="single"
      value={filtro}
      onValueChange={(nuevo) => nuevo && onFiltrar(nuevo)}
      variant="outline"
      spacing={0}
      aria-label="Filtrar solicitudes por estado"
      className="w-full overflow-hidden rounded-lg border-2 border-primary/30 bg-card"
    >
      {FILTROS.map((f) => (
        <ToggleGroupItem
          key={f.valor}
          value={f.valor}
          aria-label={`Ver ${f.etiqueta.toLowerCase()} (${conteos[f.valor]})`}
          className="h-11 flex-1 flex-col gap-0 rounded-none border-0 border-r border-primary/15 px-2 text-xs font-semibold last:border-r-0 data-[state=on]:bg-primary data-[state=on]:text-primary-foreground sm:flex-row sm:gap-2 sm:text-sm"
        >
          {f.etiqueta}
          <span className="font-mono text-[11px] opacity-80 sm:text-xs">{conteos[f.valor]}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  )
}
