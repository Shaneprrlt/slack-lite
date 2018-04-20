import React, { Component } from 'react';
import './App.css';

import store from './store-es6'
import emitter from './singletons/emitter'

import LoginView from './views/login'

class App extends Component {

  constructor(props) {
    super(props)
    let isLoggedIn = store.get('authentication').slack_access_token
    this.state = {
      loggedIn: isLoggedIn ? true : false
    }
  }

  componentDidMount() {
    const self = this
    if(!this.state.isLoggedIn) {
      emitter.getInstance().once('user-logged-in', (args) => {
        self.setState({loggedIn: true})
      })
    }
  }

  render() {
    if(this.state.loggedIn) {
      return null;
    } else {
      return <LoginView />
    }
  }
}

export default App;
