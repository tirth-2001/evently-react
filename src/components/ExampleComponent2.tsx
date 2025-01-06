import { FC } from 'react'
import { useSubscribeState } from '../hooks'

export const ExampleComponent2: FC = () => {
  const payload = useSubscribeState('time-event')

  return <div style={{ backgroundColor: 'grey' }}>{JSON.stringify(payload)}</div>
}
