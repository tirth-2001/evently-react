import { useContext } from 'react'
import { EventBus } from '../core'
import { EventContext } from '../context'

export const useEvent = (): EventBus => {
  const context = useContext(EventContext)
  if (!context) {
    throw new Error('useEvent must be used within an EventProvider')
  }
  return context
}
