import { FC } from 'react'
import { useEvent, useSubscribe } from '../hooks'

export const ExampleComponent: FC = () => {
  const eventBus = useEvent()

  useSubscribe('my-event', (payload: any) => {
    console.log('Received event:', payload)
  })

  const emitEvent = () => {
    eventBus.emit('my-event', { message: 'Hello, EventBus!', timeStamp: new Date().toDateString() })
  }

  return <button onClick={emitEvent}>Emit Event</button>
}
