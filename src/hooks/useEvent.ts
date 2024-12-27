import { useContext } from 'react'
import { EventContext } from '../context'
import { Events } from '../types'

interface EventHook {
  emitEvent: <E extends keyof Events>(eventName: E, payload: Events[E]) => void
  subscribeEvent: <E extends keyof Events>(eventName: E, callback: (payload: Events[E]) => void) => () => void
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
 * @returns A function to unsubscribe from the event.
 */
export const useEvent = (): EventHook => {
  const context = useContext(EventContext)
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider')
  }
  return {
    emitEvent: context.emit.bind(context),
    subscribeEvent: context.subscribe.bind(context),
  }
}
