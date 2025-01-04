import { createContext } from 'react'
import { EventBus } from '../core'

export const EventContext = createContext<EventBus | null>(null)
