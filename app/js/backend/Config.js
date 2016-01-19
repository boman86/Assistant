import fs from "fs"
import electron, { ipcMain as ipc } from "electron"
import username from "username"
import Immutable from "immutable"
import { exec } from "child_process"

const app = electron.app

const UserConfig = Symbol()

const PLUGINS_PATH = app.getPath("userData") + "/plugins"
const USER_CONFIG_PATH = app.getPath("userData") + "/user.config.js"

class Config {
    constructor() {
        this.loadUserConfig(config => {
            this[UserConfig] = config
        })
        this.checkPluginsFolder()

        ipc.on('save-plugin', (event, plugin) => {
            this.addPlugin(plugin, err => {
                if ( ! err) {
                    event.returnValue = plugin
                }
            })
        })

        ipc.on('check-plugin-exists', (event, githubVendorPackage) => {
            event.returnValue = Immutable.List(this[UserConfig].plugins).filter(p => p.github == githubVendorPackage).count() > 0
        })
    }

    addPlugin(plugin, cb) {
        this[UserConfig].plugins.push(plugin)

        let path = plugin.path.replace(/(\s)/, "\\ ")

        exec(`cd ${path} && npm install && npm build`, (err, stdout, stderr) => {
            cb(err || stderr)
        })

        this.persist()
    }

    userConfig(cb) {
        // Wait until it is loaded...
        var fileInterval = setInterval(() => {
            if (this[UserConfig]){
                cb(Object.assign({}, this.defaultConfig(), this[UserConfig]))

                clearInterval(fileInterval)
            }
        }, 100)
    }

    defaultConfig() {
        return {
            username: username.sync(),
            plugins: []
        }
    }

    loadUserConfig(cb) {
        fs.exists(USER_CONFIG_PATH, exists => {
            if (exists) {
                fs.readFile(USER_CONFIG_PATH, (err, res) => {
                    if ( ! err) {
                        cb(JSON.parse(res))
                    } else {
                        cb(this.defaultConfig())
                    }
                })
            } else {
                fs.writeFile(USER_CONFIG_PATH, JSON.stringify(this.defaultConfig(), null, '  '))
                cb(this.defaultConfig())
            }
        })
    }

    checkPluginsFolder() {
        fs.exists(PLUGINS_PATH, exists => ! exists ? fs.mkdir(PLUGINS_PATH) : null)
    }

    persist() {
        fs.writeFile(USER_CONFIG_PATH, JSON.stringify(this[UserConfig], null, '  '))
    }
}

module.exports = new Config()