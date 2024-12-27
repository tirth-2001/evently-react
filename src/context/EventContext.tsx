import React, { createContext, ReactNode, useMemo } from 'react'
import { EventBus } from '../core'

export const EventContext = createContext<EventBus | null>(null)

interface EventProviderProps {
  children: ReactNode
}

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  // Memoize the EventBus instance to ensure a single instance
  const eventBus = useMemo(() => new EventBus(), [])

  return <EventContext.Provider value={eventBus}>{children}</EventContext.Provider>
}
