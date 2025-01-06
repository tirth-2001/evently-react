import { FC } from 'react'
import { useEvent, useSubscribe } from '../hooks'

export const ExampleComponent: FC = () => {
  const { emitEvent } = useEvent()

  // High-priority subscriber
  useSubscribe(
    'test-event',
    payload => {
      console.log('High-priority subscriber:', payload)
    },
    3,
  )

  // Medium-priority subscriber
  useSubscribe(
    'test-event',
    payload => {
      console.log('Medium-priority subscriber:', payload)
    },
    2,
  )

  // Low-priority subscriber
  useSubscribe(
    'test-event',
    payload => {
      console.log('Low-priority subscriber:', payload)
    },
    1,
  )

  useSubscribe('my-event', payload => {
    console.log('[Subscriber] my-event received:', payload)
  })

  useSubscribe('global-event', payload => {
    console.log('[Subscriber] global-event received:', payload)
  })

  useSubscribe(['time-event', 'global-event'], (eventName, payload) => {
    console.log(`MULTI [${eventName}] received:`, payload)
  })

  const emitButtonEvent = (eventName = '') => {
    if (!eventName) return
    emitEvent(eventName, { message: 'Hello, EventBus!' })
  }

  const emitTimeEvent = (eventName = '') => {
    if (!eventName) return
    emitEvent(eventName, { time: new Date().toLocaleTimeString(), source: 'example-component' })
  }

  return (
    <div>
      <button onClick={() => emitButtonEvent('my-event')}>Emit Event</button>
      <button onClick={() => emitButtonEvent('global-event')}>Global Event</button>
      <button onClick={() => emitButtonEvent('test-event')}>Priority Event</button>
      <div style={{ marginTop: '1rem', display: 'block', background: 'aliceblue' }}>
        <button onClick={() => emitTimeEvent('time-event')}>Send current time</button>
      </div>
    </div>
  )
}
