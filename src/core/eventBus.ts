type EventCallback = (payload?: any) => void
type Middleware = (event: string, payload: any) => any

interface CachedEvent {
  payload: any
  timestamp: number
}

export class EventBus {
  private events: Map<string, EventCallback[]>
  private middlewares: Middleware[]
  private cache: Map<string, CachedEvent>
  private cacheTTL: number // Time-to-live in milliseconds
  private cacheEnabled: boolean // Toggle for caching

  constructor(cacheTTL: number = 60000, cacheEnabled: boolean = true) {
    this.events = new Map()
    this.middlewares = []
    this.cache = new Map()
    this.cacheTTL = cacheTTL
    this.cacheEnabled = cacheEnabled
  }

  // Emit an event
  emit(event: string, payload?: any): void {
    let processedPayload = payload

    // Apply middlewares
    for (const middleware of this.middlewares) {
      processedPayload = middleware(event, processedPayload)
    }

    // Cache the event if caching is enabled
    if (this.cacheEnabled) {
      this.cache.set(event, { payload: processedPayload, timestamp: Date.now() })
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

    // Replay cached event if caching is enabled and cache exists
    if (this.cacheEnabled) {
      const cachedEvent = this.cache.get(event)
      if (cachedEvent && Date.now() - cachedEvent.timestamp <= this.cacheTTL) {
        callback(cachedEvent.payload)
      }
    }

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

  // Enable caching
  enableCache(): void {
    this.cacheEnabled = true
  }

  // Disable caching
  disableCache(): void {
    this.cacheEnabled = false
    this.cache.clear() // Clear cache when disabling
  }
}
