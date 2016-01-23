'use strict'

const electron = require('electron')
const config = require('./dist/js/backend/Config')
const ipc = electron.ipcMain

const app = electron.app
const BrowserWindow = electron.BrowserWindow

var mainWindow

ipc.on('get-user-config', event => config.userConfig(c => event.returnValue = c))

function createWindow () {
    mainWindow = new BrowserWindow({ width: 800, height: 600 })
    mainWindow.loadURL('file://' + __dirname + '/index.html')
    mainWindow.webContents.openDevTools()
    mainWindow.on('closed', function() {
        mainWindow = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow()
    }
})
