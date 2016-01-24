'use strict'

const electron = require('electron')
const windowStateKeeper = require('electron-window-state')
const config = require('./dist/js/backend/Config')
const ipc = electron.ipcMain

const app = electron.app
const BrowserWindow = electron.BrowserWindow

var mainWindow;

ipc.on('get-user-config', event => config.userConfig(c => event.returnValue = c))

function createWindow () {
    let mainWindowState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 800
    });

    mainWindow = new BrowserWindow({
        title: "My Personal Assistant",
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        show: false
    })
    mainWindow.loadURL('file://' + __dirname + '/index.html')
    mainWindow.webContents.openDevTools()
    mainWindow.on('closed', function() {
        mainWindow = null
    })
    mainWindow.show()

    mainWindowState.manage(mainWindow)
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
