import { useContext } from 'react'
import { EventContext } from '../context'

interface EventHook {
  emitEvent: (eventName: string, payload?: any) => void
  subscribeEvent: (eventName: string, callback: (payload?: any) => void) => () => void
}

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
