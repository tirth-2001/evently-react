import { useContext, useEffect } from 'react'
import { EventContext } from '../context'
import { Events } from '../types'
import { Logger } from '../utils'

/**
 * useSubscribe hook to listen for specific events.
 * @param eventName The name of the event to subscribe to.
 * @param callback The callback function to handle the event.
 * @param priority The priority of the subscription.
 */
export function useSubscribe<E extends keyof Events>(
  eventName: E,
  callback: (payload: Events[E]) => void,
  priority: number = 0,
): void {
  const eventBus = useContext(EventContext)

  if (!eventBus) {
    Logger.error('useSubscribe must be used within an EventProvider.')
    throw new Error('useSubscribe must be used within an EventProvider.')
  }

  useEffect(() => {
    if (!eventName || typeof eventName !== 'string') {
      Logger.error('useSubscribe: Event name must be a non-empty string.')
      throw new Error('useSubscribe: Event name must be a non-empty string.')
    }

    if (typeof callback !== 'function') {
      Logger.error('useSubscribe: Callback must be a function.')
      throw new Error('useSubscribe: Callback must be a function.')
    }

    try {
      // Subscribe to the event
      const unsubscribe = eventBus.subscribe(eventName, callback, priority)

      // Cleanup subscription on unmount
      return () => {
        unsubscribe()
      }
    } catch (error) {
      Logger.error(`useSubscribe: Error subscribing to event "${eventName}":`, error)
      throw error
    }
  }, [eventName, callback, eventBus, priority])
}
