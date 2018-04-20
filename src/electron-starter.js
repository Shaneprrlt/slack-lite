require('dotenv').config()

const electron = require('electron')
// Module to control application life.
const app = electron.app
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow
const ipcMain = electron.ipcMain

const path = require('path')
const url = require('url')

const store = require('./store')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {

  let { width, height } = store.get('windowBounds')

  // Create the browser window.
  mainWindow = new BrowserWindow({ width, height, titleBarStyle: 'hidden' })

  // and load the index.html of the app.
  const startUrl= process.env.ELECTRON_START_URL || url.format({
    pathname: path.join(__dirname, '/../build/index.html'),
    protocol: 'file:',
    slashes: true
  })
  mainWindow.loadURL(startUrl)

  mainWindow.on('resize', () => {
    let { width, height } = mainWindow.getBounds()
    store.set('windowBounds', { width, height })
  })

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

function slackApiClientKeys() {
  return {
    clientId: process.env.REACT_APP_SLACK_CLIENT_ID,
    clientSecret: process.env.REACT_APP_CLIENT_SECRET
  }
}

ipcMain.on('slack-oauth', (event, arg) => {
  let { clientId, clientSecret } = slackApiClientKeys()
  let scope = [
      'channels:history',
      'channels:read',
      'chat:write:user',
      'mpim:history',
      'reactions:write',
      'users:read'
    ].join('%20'),
    redirectUri = 'http://localhost/auth_completed'
  let authWindow = new BrowserWindow({
    width: 800,
    height: 600,
    show: false,
    'node-integration': false,
    'web-security': false
  })
  var authUrl = `https://slack.com/oauth/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${redirectUri}`
  authWindow.loadURL(authUrl)
  authWindow.webContents.on('will-navigate', (e, newUrl) => {
    if(newUrl.substr(0, 16) == 'http://localhost') {
      let rawToken = /code=([^&]*)/.exec(newUrl) || null,
        token = (rawToken && rawToken.length > 1) ? rawToken[1] : null,
        error = /\?error=(.+)$/.exec(newUrl)
      if(token) {
        event.sender.send('slack-oauth-reply', {token})
      }
      authWindow.destroy()
    }
  })
  authWindow.on('closed', () => {
    authWindow = null
  })
  authWindow.show()
})


// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
