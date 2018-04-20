import React from 'react'
import ReactDOM from 'react-dom'
import './styles/fonts.css'
import './index.css'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import store from './store-es6'

store.set('authentication', {slack_access_token: null})

ReactDOM.render(<App />, document.getElementById('root'))
registerServiceWorker()
