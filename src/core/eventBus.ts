import { Events } from '../types'
import { Logger } from '../utils'

type EventCallback<E extends keyof Events> = (payload?: Events[E]) => void
type Middleware<E extends keyof Events> = (event: E, payload: Events[E]) => Events[E]

interface CachedEvent {
  payload: any
  timestamp: number
}

interface Subscriber<E extends keyof Events> {
  callback: EventCallback<E>
  priority: number
}

export class EventBus {
  private events: Map<keyof Events, Subscriber<any>[]>
  private globalMiddlewares: Middleware<any>[]
  private eventSpecificMiddlewares: Map<keyof Events, Middleware<any>[]>
  private cache: Map<keyof Events, CachedEvent>
  private cacheTTL: number // Time-to-live in milliseconds
  private cacheEnabled: boolean

  constructor(cacheTTL: number = 60000, cacheEnabled: boolean = true) {
    this.events = new Map()
    this.globalMiddlewares = []
    this.eventSpecificMiddlewares = new Map<keyof Events, Middleware<any>[]>()
    this.cache = new Map()
    this.cacheTTL = cacheTTL
    this.cacheEnabled = cacheEnabled
  }

  // Emit an event
  emit<E extends keyof Events>(event: E, payload?: Events[E]): void {
    let processedPayload = payload

    try {
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

      const subscribers = this.events.get(event) || []

      // Process subscribers by priority
      subscribers
        .sort((a, b) => b.priority - a.priority) // Higher priority first
        .forEach(subscriber => {
          try {
            subscriber.callback(processedPayload)
          } catch (callbackError) {
            Logger.error(`Error in callback for event "${event}":`, callbackError)
          }
        })
    } catch (emitError) {
      Logger.error(`Error emitting event "${event}":`, emitError)
    }
  }

  // Subscribe to an event with priority
  subscribe<E extends keyof Events>(event: E, callback: EventCallback<E>, priority: number = 0): () => void {
    if (!event || typeof event !== 'string') {
      Logger.error(`Invalid event name: "${event}"`)
      throw new Error(`Invalid event name: "${event}"`)
    }

    if (typeof callback !== 'function') {
      Logger.error(`Invalid callback for event "${event}". Must be a function.`)
      throw new Error(`Invalid callback for event "${event}".`)
    }

    try {
      if (!this.events.has(event)) {
        this.events.set(event, [])
      }

      this.events.get(event)?.push({ callback, priority })

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
    } catch (subscribeError) {
      Logger.error(`Error subscribing to event "${event}":`, subscribeError)
      throw subscribeError
    }
  }

  // Unsubscribe from an event
  unsubscribe<E extends keyof Events>(event: E, callback: EventCallback<E>): void {
    try {
      const subscribers = this.events.get(event) || []
      this.events.set(
        event,
        subscribers.filter(subscriber => subscriber.callback !== callback),
      )
    } catch (unsubscribeError) {
      Logger.error(`Error unsubscribing from event "${event}":`, unsubscribeError)
    }
  }

  // Register a global middleware
  use<E extends keyof Events>(middleware: Middleware<E>): void {
    try {
      this.globalMiddlewares.push(middleware)
    } catch (middlewareError) {
      Logger.error(`Error registering global middleware:`, middlewareError)
    }
  }

  // Register an event-specific middleware
  useForEvent<E extends keyof Events>(event: E, middleware: Middleware<E>): void {
    try {
      if (!this.eventSpecificMiddlewares.has(event)) {
        this.eventSpecificMiddlewares.set(event, [])
      }
      this.eventSpecificMiddlewares.get(event)?.push(middleware)
    } catch (middlewareError) {
      Logger.error(`Error registering middleware for event "${event}":`, middlewareError)
    }
  }
}
