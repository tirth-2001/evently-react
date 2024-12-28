import { LOGGER_PREFIX } from '../constants'

export const Logger = {
  error: (message: string, ...optionalParams: any[]): void => {
    console.error(`${LOGGER_PREFIX} ${message}`, ...optionalParams)
  },

  warn: (message: string, ...optionalParams: any[]): void => {
    console.warn(`${LOGGER_PREFIX} ${message}`, ...optionalParams)
  },

  info: (message: string, ...optionalParams: any[]): void => {
    console.info(`${LOGGER_PREFIX} ${message}`, ...optionalParams)
  },

  debug: (message: string, ...optionalParams: any[]): void => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`${LOGGER_PREFIX} ${message}`, ...optionalParams)
    }
  },
}
