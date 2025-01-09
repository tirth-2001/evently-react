import { FC, useEffect, useState } from 'react'
import { useEvent, useSubscribe } from '../hooks'
import { emitExternalEvent, subscribeExternalEvent, transformTimeEvent } from '../utils/transform'

export const ExampleComponent: FC = () => {
  const { emitEvent, eventBus } = useEvent()

  const [externalPayload, setExternalPayload] = useState<any>({})

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

  useEffect(() => {
    subscribeExternalEvent('external-event', payload => {
      setExternalPayload(payload)
    })
  }, [])

  return (
    <div>
      <button onClick={() => emitButtonEvent('my-event')}>Emit Event</button>
      <button onClick={() => emitButtonEvent('global-event')}>Global Event</button>
      <button onClick={() => emitButtonEvent('test-event')}>Priority Event</button>
      <div style={{ marginTop: '1rem', display: 'block', background: 'yellow' }}>
        <button onClick={() => transformTimeEvent('time-event', eventBus)}>Add middleware to time event</button>
        <button onClick={() => emitTimeEvent('time-event')}>Send current time</button>
      </div>
      <div style={{ marginBlock: '2rem', display: 'block', background: 'red' }}>
        <h4>External Emit Subscribe check</h4>
        <button onClick={() => emitExternalEvent('external-event', { isExternal: true, source: 'react component' })}>
          External non react external emit
        </button>
        <span>Subscribed payload : {JSON.stringify(externalPayload)}</span>
      </div>
    </div>
  )
}
