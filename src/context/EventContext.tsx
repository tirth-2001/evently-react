import React, { createContext, ReactNode, useMemo } from 'react'
import { EventBus } from '../core'
import { CacheEnabled, CacheTTL } from '../constants'

const defaultConfig = {
  cacheTTL: CacheTTL,
  cacheEnabled: CacheEnabled,
}

export const EventContext = createContext<EventBus | null>(null)

interface EventProviderProps {
  children: ReactNode
  cacheTTL?: number
  cacheEnabled?: boolean
}

export const EventProvider: React.FC<EventProviderProps> = ({
  children,
  cacheTTL = defaultConfig.cacheTTL,
  cacheEnabled = defaultConfig.cacheEnabled,
}) => {
  // Memoize the EventBus instance to ensure a single instance
  const eventBus = useMemo(() => new EventBus({ cacheEnabled, cacheTTL }), [cacheEnabled, cacheTTL])

  return <EventContext.Provider value={eventBus}>{children}</EventContext.Provider>
}
