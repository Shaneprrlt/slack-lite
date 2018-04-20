import ee from 'event-emitter'
import store from '../store-es6'
import { WebClient } from '@slack/client'

export const authorizeSlack = () => {
  return new Promise((resolve, reject) => {
    const ipcRenderer = window.require('electron').ipcRenderer
    ipcRenderer.once('slack-oauth-reply', (event, {token}) => {
      resolve(token)
    })
    ipcRenderer.send('slack-oauth', 'getToken')
  })
}
