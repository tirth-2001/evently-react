import { useContext, useEffect } from 'react'
import { EventContext } from '../context'
import { Events } from '../types'

/**
 * useSubscribe hook to listen for specific events.
 * @param eventName The name of the event to subscribe to.
 * @param callback The callback function to handle the event.
 */

export function useSubscribe<E extends keyof Events>(eventName: E, callback: (payload: Events[E]) => void): void {
  const eventBus = useContext(EventContext)

  if (!eventBus) {
    throw new Error('useSubscribe must be used within an EventProvider.')
  }

  useEffect(() => {
    // Subscribe to the event
    const unsubscribe = eventBus.subscribe(eventName, callback)

    // Cleanup subscription on unmount
    return () => {
      unsubscribe()
    }
  }, [eventName, callback, eventBus])
}
