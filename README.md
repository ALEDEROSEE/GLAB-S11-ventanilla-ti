# Ventanilla TI · Solicitudes de soporte técnico

Aplicación en React para registrar y administrar solicitudes de soporte técnico. Es la TAREA del
**Laboratorio N.º 11 – Comunicación entre componentes en ReactJS** (Desarrollo de Aplicaciones Empresariales).

Los datos viven solo en memoria: al recargar la página se pierden.

## Qué hace

- Registra solicitudes con **título, descripción, solicitante y prioridad** (baja, media o alta).
- Valida antes de registrar y muestra un mensaje claro por campo (título mínimo 5 caracteres, descripción
  mínimo 15, solicitante obligatorio).
- Cambia el estado de cada solicitud entre **pendiente, en proceso y resuelta** y permite eliminarla.
- Filtra por estado y muestra cuántas hay en cada uno.

## Cómo se comunican los componentes

`App` es el único que guarda datos (`useState`); todos los demás reciben valores y funciones por props.

| Componente | Recibe por props | Avisa al padre con |
| --- | --- | --- |
| `SolicitudForm` | `onAgregar` | `onAgregar(datos)` al enviar un formulario válido |
| `FiltrosSolicitudes` | `filtro`, `conteos`, `onFiltrar` | `onFiltrar(estado)` |
| `ListaSolicitudes` | `solicitudes` (ya filtradas), `hayRegistradas`, `onCambiarEstado`, `onEliminar` | reenvía las acciones de cada item |
| `SolicitudItem` | `solicitud`, `onCambiarEstado`, `onEliminar` | `onCambiarEstado(id, estado)` · `onEliminar(id)` |

Los hijos devuelven siempre el **id** de la solicitud (su número de ticket) y no su posición en la lista:
así eliminar o cambiar el estado dentro de un filtro actúa sobre la solicitud correcta.

## Tecnologías

React 19 · Vite 8 · Tailwind CSS 4 · shadcn/ui (Radix) · Vitest + Testing Library.
Tipografías con Fontsource: Fraunces, Instrument Sans y JetBrains Mono.

## Ejecutar

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # 16 pruebas (validación, filtros y flujo completo)
npm run build    # versión de producción en dist/
```

## Estructura

```
src/
  App.jsx                      estado y reparto de props
  components/                  SolicitudForm, ListaSolicitudes, SolicitudItem, FiltrosSolicitudes
  components/ui/               componentes de shadcn/ui
  lib/solicitudes.js           estados, prioridades, validación y filtro
  test/setup.js                preparación de las pruebas
```
