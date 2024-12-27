import { FC } from 'react'
import { useEvent, useSubscribe } from '../hooks'

export const ExampleComponent: FC = () => {
  const { emitEvent } = useEvent()

  useSubscribe('my-event', payload => {
    console.log('[Subscriber] my-event received:', payload)
  })

  useSubscribe('global-event', payload => {
    console.log('[Subscriber] global-event received:', payload)
  })

  const emitButtonEvent = (eventName = '') => {
    if (!eventName) return
    emitEvent(eventName, { message: 'Hello, EventBus!' })
  }

  return (
    <div>
      <button onClick={() => emitButtonEvent('my-event')}>Emit Event</button>
      <button onClick={() => emitButtonEvent('global-event')}>Global Event</button>
    </div>
  )
}
