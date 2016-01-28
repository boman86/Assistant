'use strict'

const electron = require('electron')
const windowStateKeeper = require('electron-window-state')
const config = require('./dist/js/backend/Config')
const ipc = electron.ipcMain
const Immutable = require('Immutable')

const app = electron.app
const BrowserWindow = electron.BrowserWindow

var mainWindow;
var windows = [];

ipc.on('get-user-config', event => config.userConfig(c => event.returnValue = c))
ipc.on('show-main-window', () => mainWindow.show())
ipc.on('open-window', (event, url) => {

    var item = Immutable.List(windows).filter(win => win.url == url).first()

    if (item) {
        item.win.show()
    } else {
        var index = windows.length

        windows[index] = {
            win: new BrowserWindow({
                width: 800,
                height: 600,
                show: true,
                titleBarStyle: 'hidden-inset'
            }),
            url: url
        }
        windows[index].win.loadURL('file://' + __dirname + '/' + url)
        windows[index].win.on('closed', () => {
            windows.splice(index, 1)
        })
    }
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

app.on('ready', () => createWindow())

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
