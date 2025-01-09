import { EventBus } from '../core'

export function transformTimeEvent(eventName: string, eventBus: EventBus) {
  eventBus.useForEvent(eventName, (_event, payload) => {
    return { ...payload, transformed: true }
  })
}

const externalEventBus = new EventBus()

export function emitExternalEvent(eventName: string, payload: any) {
  externalEventBus.emit(eventName, payload)
}

export function subscribeExternalEvent(eventName: string, callback: (payload: any) => void) {
  externalEventBus.subscribe(eventName, callback)
}
