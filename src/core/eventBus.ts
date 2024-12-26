type EventCallback = (payload?: any) => void
type Middleware = (event: string, payload: any) => any

export class EventBus {
  private events: Map<string, EventCallback[]>
  private middlewares: Middleware[]

  constructor() {
    this.events = new Map()
    this.middlewares = []
  }

  // Emit an event
  emit(event: string, payload?: any): void {
    let processedPayload = payload

    // Apply middlewares
    for (const middleware of this.middlewares) {
      processedPayload = middleware(event, processedPayload)
    }

    const callbacks = this.events.get(event) || []
    callbacks.forEach(callback => callback(processedPayload))
  }

  // Subscribe to an event
  subscribe(event: string, callback: EventCallback): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }

    this.events.get(event)?.push(callback)

    // Return an unsubscribe function
    return () => {
      this.unsubscribe(event, callback)
    }
  }

  // Unsubscribe from an event
  unsubscribe(event: string, callback: EventCallback): void {
    const callbacks = this.events.get(event) || []
    this.events.set(
      event,
      callbacks.filter(cb => cb !== callback),
    )
  }

  // Register middleware
  use(middleware: Middleware): void {
    this.middlewares.push(middleware)
  }
}
