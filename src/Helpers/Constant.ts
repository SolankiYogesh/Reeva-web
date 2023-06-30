import { EventEmitter } from 'fbemitter'

const eventListenerKeys = {
  updateToken: 'UPDATE_TOKEN',
  logOut: 'LOG_OUT'
}
export const emitter = new EventEmitter()

const Plans = {
  Free: 'Free',
  Plus: 'Plus',
  Pro: 'Pro'
}

const token = ''
const refresh = ''

export default {
  eventListenerKeys,
  token,
  refresh,
  Plans
}
