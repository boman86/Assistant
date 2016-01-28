import { app } from "electron"
import { List } from "Immutable"
import { exec } from "child_process"
import Utilities from "../Utilities"
import { ipcMain as ipc } from "electron"
import fs from "fs"

const PLUGINS_PATH = app.getPath("userData") + "/plugins"
const PLUGINS = Symbol()

class PluginConfig {

    constructor(manager) {
        this.manager = manager

        this.checkPluginsFolder()
        this.registerListeners()
        
        this[PLUGINS] = List([])
        this.manager.userConfig(config => {
            this[PLUGINS] = List(config.get('plugins'))
        })
    }

    defaultConfig() {
        return {
            plugins: this[PLUGINS].toArray()
        }
    }

    registerListeners() {
        ipc.on('save-plugin', (event, plugin) => this.savePlugin(event, plugin))
        ipc.on('check-plugin-exists', (event, githubVendorPackage) => this.checkPluginExists(event, githubVendorPackage))
        ipc.on('remove-plugin', (event, githubVendorPackage) => this.removePlugin(event, githubVendorPackage))
    }

    savePlugin(event, plugin) {
        this.addPlugin(plugin, err => {
            event.sender.send('saved-plugin', { err, plugin })
        })
    }

    checkPluginExists(event, githubVendorPackage) {
        event.returnValue = this[PLUGINS].filter(p => p.github == githubVendorPackage).count() > 0
    }

    removePlugin(event, githubVendorPackage)  {
        let plugin = this[PLUGINS].filter(p => p.github == githubVendorPackage).first()

        if (plugin) {
            Utilities.rmdir(plugin.path)
            this[PLUGINS] = this[PLUGINS].filter(p => p.github != githubVendorPackage).toArray()
            this.manager.setState({
                plugins: this[PLUGINS].toArray()
            })
            event.returnValue = plugin
        } else {
            event.returnValue = false
        }
    }

    addPlugin(plugin, cb) {
        this[PLUGINS] = this[PLUGINS].push(plugin)

        let path = plugin.path.replace(/(\s)/, "\\ ")

        exec(`cd ${path} && npm install --production`, (err, stdout, stderr) => {
            cb(err || stderr)
        })

        this.manager.setState({
            plugins: this[PLUGINS].toArray()
        })
    }

    checkPluginsFolder() {
        fs.exists(PLUGINS_PATH, exists => ! exists ? fs.mkdir(PLUGINS_PATH) : null)
    }

}

module.exports = PluginConfig
