'use strict'

const electron = require('electron')
const windowStateKeeper = require('electron-window-state')
const config = require('./dist/js/backend/Config')
const ipc = electron.ipcMain
const Immutable = require('Immutable')
const menuTemplate = require('./dist/js/Menu')

var uuid = require('uuid')
uuid = uuid.v4

const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Menu = electron.Menu

var mainWindow;
var mainWindowId = null;
var windows = [];

ipc.on('show-main-window', () => {
    if (mainWindow) {
        mainWindow.show()
    } else {
        createWindow()
    }
})
ipc.on('get-user-config', event => config.userConfig(c => event.returnValue = c))
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
                show: false,
                'min-height': 450,
                'min-width': 650,
                titleBarStyle: 'hidden-inset'
            }),
            url: url,
            id: uuid()
        }

        config.addWindow(windows[index])

        if (/https?/i.test(url)) {
            windows[index].win.loadURL(url)
        } else {
            windows[index].win.loadURL('file://' + __dirname + '/' + url)
        }

        windows[index].win.webContents.openDevTools()

        windows[index].win.webContents.on('dom-ready', () => {
            windows[index].win.show()
        })

        windows[index].win.on('closed', () => {
            config.removeWindow(windows[index].id)
            windows.splice(index, 1)
        })
    }
})

var createWindow = () => {
    mainWindowId = uuid()

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

    Menu.setApplicationMenu(
        Menu.buildFromTemplate(
            menuTemplate(mainWindow.webContents, app.getName())
        )
    )

    config.addWindow({
        win: mainWindow,
        id: mainWindowId
    })

    mainWindow.loadURL('file://' + __dirname + '/index.html')

    // mainWindow.webContents.openDevTools()
    mainWindow.webContents.on('dom-ready', () => {
        mainWindow.show()
    })
    mainWindow.on('closed', () => {
        config.removeWindow(mainWindowId)

        mainWindow = null
        mainWindowId = null
    })
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
