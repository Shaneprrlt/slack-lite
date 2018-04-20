import React from 'react'
import emitter from '../singletons/emitter'
import * as NotificationService from '../services/notifications'
import * as AuthorizationService from '../services/authorization'

import store from '../store-es6'

class Login extends React.Component {
  constructor(props) {
    super(props)

    this.login = this.login.bind(this)
  }

  async login() {
    AuthorizationService.authorizeSlack().then((token) => {
      store.set('authentication', {slack_access_token: token})
      emitter.getInstance().emit('user-logged-in', token)
    })
  }

  render() {
    return (
      <div className='container'>
        <div className='login-container'>
          <div className='heading'>
            <p>Free your mind to focus on work without losing connection to internal communications.</p>
          </div>
          <div className='cta'>
            <button onClick={() => {this.login()}}>Login to Slack</button>
          </div>
          <div className='credits'>
            <div>Created by <a href='https://shaneperreault.com' target='_blank'>Shane Perreault</a></div>
          </div>
        </div>
      </div>
    )
  }
}

export default Login
