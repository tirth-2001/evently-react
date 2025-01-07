import { useContext, useEffect, useState } from 'react'
import { EventContext } from '../context'
import { Events } from '../types'
import { Logger } from '../utils'

/**
 * useSubscribeState hook to listen for specific events and track the latest event payload as state.
 * @param eventName The name of the event to subscribe to.
 * @returns The latest payload emitted by the event.
 */
export function useSubscribeState<E extends keyof Events>(eventName: E): Events[E] | undefined {
  const eventBus = useContext(EventContext)
  const [state, setState] = useState<Events[E] | undefined>(undefined)

  if (!eventBus) {
    Logger.error('useSubscribeState must be used within an EventProvider.')
    throw new Error('useSubscribeState must be used within an EventProvider.')
  }

  useEffect(() => {
    if (!eventName || typeof eventName !== 'string') {
      Logger.error('useSubscribeState: Event name must be a non-empty string.')
      throw new Error('useSubscribeState: Event name must be a non-empty string.')
    }

    try {
      // Subscribe to the event and update the state on event emission
      const unsubscribe = eventBus.subscribe(eventName, (payload: Events[E]) => {
        setState(payload)
      })

      // Cleanup subscription on unmount
      return () => {
        unsubscribe()
      }
    } catch (error) {
      Logger.error(`useSubscribeState: Error subscribing to event "${eventName}":`, error)
      throw error
    }
  }, [eventName, eventBus])

  return state
}
