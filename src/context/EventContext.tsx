import React, { createContext, ReactNode } from 'react'
import { EventBus } from '../core'

export const EventContext = createContext<EventBus | null>(null)

interface EventProviderProps {
  children: ReactNode
}

// Singleton instance of the EventBus
const eventBus = new EventBus()

export const EventProvider: React.FC<EventProviderProps> = ({ children }) => {
  return <EventContext.Provider value={eventBus}>{children}</EventContext.Provider>
}
