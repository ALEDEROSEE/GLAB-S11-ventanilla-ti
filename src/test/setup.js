import '@testing-library/jest-dom/vitest'

// jsdom no trae ResizeObserver y el RadioGroup de Radix lo usa dentro de un <form>.
class ResizeObserverFalso {
  observe() {}
  unobserve() {}
  disconnect() {}
}
globalThis.ResizeObserver ??= ResizeObserverFalso
