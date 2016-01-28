'use strict'

const electron = require('electron')
const windowStateKeeper = require('electron-window-state')
const config = require('./dist/js/backend/Config')
const ipc = electron.ipcMain

const app = electron.app
const BrowserWindow = electron.BrowserWindow

var mainWindow;

ipc.on('get-user-config', event => config.userConfig(c => event.returnValue = c))
ipc.on('show-main-windows', () => mainWindow.show())

ipc.on('open-window', (event, data) => {
    let win = new BrowserWindow({
        width: data.width,
        height: data.height,
        allowRunningInsecureContent: true,
        allowDisplayingInsecureContent: true
    })

    win.loadURL(data.url)
})

var createWindow = () => {
    let mainWindowState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 800
    });

    mainWindow = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        show: false,
        titleBarStyle: 'hidden-inset'
    })
    mainWindow.loadURL('file://' + __dirname + '/index.html')
    // mainWindow.webContents.openDevTools()
    mainWindow.on('closed', () => mainWindow = null)
    mainWindowState.manage(mainWindow)
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow()
    }
})
