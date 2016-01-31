import fs from "fs"
import electron, { ipcMain as ipc, app } from "electron"
import { List, Map } from "immutable"

import ThemeConfig from "./Config/Theme"
import PluginConfig from "./Config/Plugin"
import PersonalConfig from "./Config/Personal"
import StartupConfig from "./Config/Startup"

const CONFIGURATIONS = Symbol()
const USER_CONFIG = Symbol()
const USER_CONFIG_PATH = app.getPath("userData") + "/user.config.json"

const configurations = [
    PersonalConfig,
    StartupConfig,
    ThemeConfig,
    PluginConfig
]

class Config {
    defaultConfig() {
        return this[CONFIGURATIONS].reduce((prev, conf) => {
            return prev.merge(conf.defaultConfig())
        }, Map({}))
    }

    constructor() {
        this.loadUserConfig(config => {
            this[USER_CONFIG] = Map(config)
        })

        this.wins = List([])

        this[CONFIGURATIONS] = List(configurations).map(conf => new conf(this))
    }

    addWindow(win) {
        this.wins = this.wins.push(win)
    }

    removeWindow(id) {
        this.wins = this.wins.filter(win => win.id != id)
    }

    notifyWindows(event, data) {
        this.wins.forEach(w => w.win.webContents.send(event, data))
    }

    setState(data) {
        this[USER_CONFIG] = this[USER_CONFIG].merge(data)

        this.persist()
    }

    userConfig(cb) {
        // Wait until it is loaded...
        var fileInterval = setInterval(() => {
            if (this[USER_CONFIG]){
                cb(Map({}).merge(this.defaultConfig()).merge(this[USER_CONFIG]))

                clearInterval(fileInterval)
            }
        }, 200)
    }

    loadUserConfig(cb) {
        fs.exists(USER_CONFIG_PATH, exists => {
            if (exists) {
                fs.readFile(USER_CONFIG_PATH, (err, res) => {
                    cb(err ? this.defaultConfig() : JSON.parse(res))
                })
            } else {
                fs.writeFile(USER_CONFIG_PATH, JSON.stringify(this.defaultConfig(), null, '  '))
                cb(this.defaultConfig())
            }
        })
    }

    persist() {
        fs.writeFile(USER_CONFIG_PATH, JSON.stringify(this.defaultConfig().merge(this[USER_CONFIG]).toJS(), null, '  '))
    }
}

module.exports = new Config()
