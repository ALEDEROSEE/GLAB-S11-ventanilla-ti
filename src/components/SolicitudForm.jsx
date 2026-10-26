import { useRef, useState } from 'react'
import { SendHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { PRIORIDADES, validarSolicitud } from '@/lib/solicitudes'

const VACIO = { titulo: '', descripcion: '', solicitante: '', prioridad: 'media' }

const PUNTO = { baja: 'bg-baja', media: 'bg-media', alta: 'bg-alta' }

function Error({ id, mensaje }) {
  if (!mensaje) return null
  return (
    <p id={id} role="alert" className="mt-1.5 text-[13px] font-medium text-destructive">
      {mensaje}
    </p>
  )
}

// Recibe UNA funcion por props (onAgregar). No sabe dónde se guardan las solicitudes:
// solo valida, entrega los datos al padre y se limpia.
export default function SolicitudForm({ onAgregar }) {
  const [valores, setValores] = useState(VACIO)
  const [errores, setErrores] = useState({})
  const tituloRef = useRef(null)
  const descripcionRef = useRef(null)
  const solicitanteRef = useRef(null)

  const cambiar = (campo) => (e) => {
    setValores((v) => ({ ...v, [campo]: e.target.value }))
    if (errores[campo]) setErrores((prev) => ({ ...prev, [campo]: undefined }))
  }

  const enviar = (e) => {
    e.preventDefault()
    const encontrados = validarSolicitud(valores)
    setErrores(encontrados)

    const campos = { titulo: tituloRef, descripcion: descripcionRef, solicitante: solicitanteRef }
    const primero = Object.keys(campos).find((c) => encontrados[c])
    if (primero) {
      campos[primero].current?.focus()
      return
    }

    onAgregar({
      titulo: valores.titulo.trim(),
      descripcion: valores.descripcion.trim(),
      solicitante: valores.solicitante.trim(),
      prioridad: valores.prioridad,
    })
    setValores(VACIO)
    tituloRef.current?.focus()
  }

  return (
    <Card className="border-2 border-dashed border-primary/35 bg-card shadow-[6px_6px_0_0_rgb(31_77_58/0.12)]">
      <CardHeader className="gap-1">
        <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-ring">Formulario 01</p>
        <CardTitle className="font-heading text-2xl font-semibold">Nueva solicitud</CardTitle>
        <CardDescription>Mientras más claro lo cuentes, más rápido lo resolvemos.</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={enviar} noValidate className="flex flex-col gap-5">
          <div>
            <Label htmlFor="titulo" className="mb-1.5">Título</Label>
            <Input
              id="titulo"
              ref={tituloRef}
              value={valores.titulo}
              onChange={cambiar('titulo')}
              placeholder="Ej. La impresora del 2.º piso no imprime"
              aria-invalid={Boolean(errores.titulo)}
              aria-describedby="error-titulo"
              className="h-10 bg-background"
            />
            <Error id="error-titulo" mensaje={errores.titulo} />
          </div>

          <div>
            <Label htmlFor="descripcion" className="mb-1.5">Descripción</Label>
            <Textarea
              id="descripcion"
              ref={descripcionRef}
              value={valores.descripcion}
              onChange={cambiar('descripcion')}
              rows={4}
              placeholder="¿Qué pasó? ¿Desde cuándo? ¿Sale algún mensaje de error?"
              aria-invalid={Boolean(errores.descripcion)}
              aria-describedby="error-descripcion"
              className="bg-background"
            />
            <Error id="error-descripcion" mensaje={errores.descripcion} />
          </div>

          <div>
            <Label htmlFor="solicitante" className="mb-1.5">Solicitante</Label>
            <Input
              id="solicitante"
              ref={solicitanteRef}
              value={valores.solicitante}
              onChange={cambiar('solicitante')}
              placeholder="Nombre y apellido"
              aria-invalid={Boolean(errores.solicitante)}
              aria-describedby="error-solicitante"
              className="h-10 bg-background"
            />
            <Error id="error-solicitante" mensaje={errores.solicitante} />
          </div>

          <fieldset>
            <legend className="mb-2 text-sm font-medium">Prioridad</legend>
            <RadioGroup
              value={valores.prioridad}
              onValueChange={(prioridad) => setValores((v) => ({ ...v, prioridad }))}
              className="grid-cols-3 gap-2"
            >
              {PRIORIDADES.map((p) => (
                <Label
                  key={p.valor}
                  htmlFor={`prioridad-${p.valor}`}
                  title={p.pista}
                  className={cn(
                    'flex cursor-pointer items-center gap-2 rounded-md border-2 bg-background px-2.5 py-2 text-[13px] font-semibold transition',
                    valores.prioridad === p.valor
                      ? 'border-primary shadow-[2px_2px_0_0_rgb(31_77_58/0.35)]'
                      : 'border-border hover:border-primary/50',
                  )}
                >
                  <RadioGroupItem id={`prioridad-${p.valor}`} value={p.valor} className="sr-only" />
                  <span className={cn('size-2.5 shrink-0 rounded-full', PUNTO[p.valor])} />
                  {p.etiqueta}
                </Label>
              ))}
            </RadioGroup>
            <p className="mt-2 text-xs text-muted-foreground">
              {PRIORIDADES.find((p) => p.valor === valores.prioridad)?.pista}
            </p>
          </fieldset>

          <Button type="submit" size="lg" className="h-11 gap-2 text-[15px] font-semibold">
            Registrar solicitud
            <SendHorizontal />
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
