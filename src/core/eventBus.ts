import { Events } from '../types'

type EventCallback<E extends keyof Events> = (payload?: Events[E]) => void
type Middleware<E extends keyof Events> = (event: E, payload: Events[E]) => Events[E]

interface CachedEvent {
  payload: any
  timestamp: number
}

export class EventBus {
  private events: Map<keyof Events, EventCallback<any>[]>
  private globalMiddlewares: Middleware<any>[]
  private eventSpecificMiddlewares: Map<keyof Events, Middleware<any>[]>
  private cache: Map<keyof Events, CachedEvent>
  private cacheTTL: number // Time-to-live in milliseconds
  private cacheEnabled: boolean

  constructor(cacheTTL: number = 60000, cacheEnabled: boolean = true) {
    this.events = new Map()
    this.globalMiddlewares = []
    this.eventSpecificMiddlewares = new Map<string, Middleware<any>[]>()
    this.cache = new Map()
    this.cacheTTL = cacheTTL
    this.cacheEnabled = cacheEnabled
  }

  // Emit an event
  emit<E extends keyof Events>(event: E, payload?: Events[E]): void {
    let processedPayload = payload

    // Apply global middlewares
    for (const middleware of this.globalMiddlewares) {
      processedPayload = middleware(event, processedPayload)
    }

    // Apply event-specific middlewares
    const eventMiddlewares = this.eventSpecificMiddlewares.get(event) || []
    for (const middleware of eventMiddlewares) {
      processedPayload = middleware(event, processedPayload)
    }

    // Cache the event if enabled
    if (this.cacheEnabled) {
      this.cache.set(event, { payload: processedPayload, timestamp: Date.now() })
    }

    const callbacks = this.events.get(event) || []
    callbacks.forEach(callback => callback(processedPayload))
  }

  // Subscribe to an event
  subscribe<E extends keyof Events>(event: E, callback: EventCallback<E>): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, [])
    }

    this.events.get(event)?.push(callback)

    // Replay cached event if enabled and valid
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
  unsubscribe<E extends keyof Events>(event: E, callback: EventCallback<E>): void {
    const callbacks = this.events.get(event) || []
    this.events.set(
      event,
      callbacks.filter(cb => cb !== callback),
    )
  }

  // Register a global middleware
  use<E extends keyof Events>(middleware: Middleware<E>): void {
    this.globalMiddlewares.push(middleware)
  }

  // Register an event-specific middleware
  useForEvent<E extends keyof Events>(event: E, middleware: Middleware<E>): void {
    if (!this.eventSpecificMiddlewares.has(event)) {
      this.eventSpecificMiddlewares.set(event, [])
    }
    this.eventSpecificMiddlewares.get(event)?.push(middleware)
  }
}
