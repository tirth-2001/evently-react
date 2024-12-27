import React, { createContext, ReactNode, useMemo } from 'react'
import { EventBus } from '../core'

export const EventContext = createContext<EventBus | null>(null)

interface EventProviderProps {
  children: ReactNode
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  // Memoize the EventBus instance to ensure a single instance
  const eventBus = useMemo(() => new EventBus(), [])

  // Register a global middleware
  eventBus.use((event, payload) => {
    console.log(`[Global Middleware] Event: ${event}, Payload:`, payload)
    return { ...payload, processed: true }
  })

  eventBus.use((event, payload) => {
    console.log(`[Global Middleware] Event: ${event}, Payload:`, payload)
    return { ...payload, emitTimestamp: new Date().toTimeString() }
  })

  // Register an event-specific middleware
  eventBus.useForEvent('my-event', (event, payload) => {
    console.log(`[Event-Specific Middleware] Event: ${event}, Payload:`, payload)
    return { ...payload, extraInfo: 'event-specific processing' }
  })

  return <EventContext.Provider value={eventBus}>{children}</EventContext.Provider>
}
