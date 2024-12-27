import { FC, useEffect } from 'react'
import { useEvent, useSubscribe } from '../hooks'

export const ExampleComponent: FC = () => {
  const { emitEvent } = useEvent()

  // test late event subscription
  useSubscribe('my-event', (payload: any) => {
    console.log('Received event:', payload)
  })

  const emitButtonEvent = () => {
    emitEvent('my-event', { message: 'Hello, EventBus!', timeStamp: new Date().toTimeString() })
  }

  useEffect(() => {
    // Emit an event before subscribing
    emitEvent('my-event', { message: 'Hello from EventBus!', timeStamp: new Date().toTimeString() })

    // Emit another event after subscribing
    setTimeout(() => {
      emitEvent('my-event', { message: 'Another event after subscribing!', timeStamp: new Date().toTimeString() })
    }, 2000)
  }, [emitEvent])

  return (
    <div>
      <button onClick={emitButtonEvent}>Emit Event</button>
    </div>
  )
}
