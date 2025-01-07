import { useContext, useEffect } from 'react'
import { EventContext } from '../context'
import { Events } from '../types'
import { Logger } from '../utils'

/**
 * useSubscribe hook to listen for one or multiple events.
 * @param eventNames The name(s) of the events to subscribe to.
 * @param callback The callback function to handle the event(s).
 * @param priority The priority of the subscription.
 */
export function useSubscribe<E extends keyof Events>(
  eventNames: E | E[],
  callback: (eventName: E, payload: Events[E]) => void,
  priority: number = 0,
): void {
  const eventBus = useContext(EventContext)

  if (!eventBus) {
    Logger.error('useSubscribe must be used within an EventProvider.')
    throw new Error('useSubscribe must be used within an EventProvider.')
  }

  useEffect(() => {
    const eventArray = Array.isArray(eventNames) ? eventNames : [eventNames]

    if (eventArray.some(event => !event || typeof event !== 'string')) {
      Logger.error('useSubscribe: Event names must be non-empty strings.')
      throw new Error('useSubscribe: Event names must be non-empty strings.')
    }

    if (typeof callback !== 'function') {
      Logger.error('useSubscribe: Callback must be a function.')
      throw new Error('useSubscribe: Callback must be a function.')
    }

    const unsubscribes = eventArray.map(eventName => {
      return eventBus.subscribe(
        eventName,
        payload => {
          try {
            callback(eventName, payload)
          } catch (error) {
            Logger.error(`Error in useSubscribe callback for event "${eventName}":`, error)
          }
        },
        priority,
      )
    })

    // Cleanup all subscriptions on unmount
    return () => {
      unsubscribes.forEach(unsubscribe => unsubscribe())
    }
  }, [eventNames, callback, eventBus, priority])
}
