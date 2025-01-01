import { useContext } from 'react'
import { EventContext } from '../context'
import { Events } from '../types'
import { Logger } from '../utils'
import { EventBus } from '../core'

interface EventHook {
  emitEvent: <E extends keyof Events>(eventName: E, payload: Events[E]) => void
  subscribeEvent: <E extends keyof Events>(
    eventName: E,
    callback: (payload: Events[E]) => void,
    priority?: number,
  ) => () => void
  eventBus: EventBus
}

/**
 * useEvent hook to emit and subscribe to events.
 * @returns An object containing `emitEvent` and `subscribeEvent` functions.
 *
 * `emitEvent` - Emits an event with the given name and payload.
 * @param eventName The name of the event to emit.
 * @param payload The payload to send with the event.
 *
 * `subscribeEvent` - Subscribes to an event with the given name and callback.
 * @param eventName The name of the event to subscribe to.
 * @param callback The callback function to handle the event.
 * @param priority The priority of the subscription.
 * @returns A function to unsubscribe from the event.
 *
 * `eventBus` - The full EventBus instance for advanced use cases (e.g., middleware).
 */
export const useEvent = (): EventHook => {
  const context = useContext(EventContext)

  if (!context) {
    Logger.error('useEvent must be used within an EventProvider')
    throw new Error('useEvent must be used within an EventProvider')
  }

  return {
    emitEvent: (eventName, payload) => {
      try {
        context.emit(eventName, payload)
      } catch (error) {
        Logger.error(`useEvent: Error emitting event "${eventName}":`, error)
      }
    },
    subscribeEvent: (eventName, callback, priority = 0) => {
      try {
        return context.subscribe(eventName, callback, priority)
      } catch (error) {
        Logger.error(`useEvent: Error subscribing to event "${eventName}":`, error)
        throw error
      }
    },
    eventBus: context,
  }
}
