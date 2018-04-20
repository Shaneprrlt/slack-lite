const electron = window.require('electron')
const fs = window.require('fs')
const path = window.require('path')

class Store {
  constructor(opts) {
    const userDataPath = (electron.app || electron.remote.app).getPath('userData')

    this.path = path.join(userDataPath, opts.configName + '.json')
    this.data = parseDataFile(this.path, opts.defaults)
  }

  get(key) {
    return this.data[key]
  }

  set(key, val) {
    this.data[key] = val
    fs.writeFileSync(this.path, JSON.stringify(this.data))
  }
}

function parseDataFile(filePath, defaults) {
  try {
    return JSON.parse(fs.readFileSync(filePath))
  } catch(e) {
    return defaults
  }
}

const store = new Store({
  configName: 'user-preferences',
  defaults: {
    windowBounds: {
      width: 463,
      height: 600
    },
    authentication: {
      slack_access_token: null
    }
  }
})


export default store

// Credit: Cameron Nokes
// https://codeburst.io/how-to-store-user-data-in-electron-3ba6bf66bc1e
