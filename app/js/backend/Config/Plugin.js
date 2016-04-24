import clone from "git-clone"
import fs from "fs"
import { exec } from "child_process"
import { app } from "electron"
import { ipcMain as ipc } from "electron"
import { List } from "Immutable"

import Utilities from "../Utilities"

const PLUGINS_PATH = app.getPath("userData") + "/plugins"
const PLUGINS = Symbol()

class PluginConfig {

    constructor(manager) {
        this.manager = manager

        this.registerEventListeners()
        this.checkPluginsFolder()

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

    registerEventListeners() {
        ipc.on('check-plugin-exists', (event, data) => {
            event.returnValue = this.checkPluginExists(data)
        })

        ipc.on('install-plugin', (event, data) => {
            this.installPlugin(data, () => {
                console.log("Installed: ", data)
            })
        })

        ipc.on('remove-plugin', (event, data) => {
            this.removePlugin(data, () => {
                console.log("Removed: ", data)
            })
        })
    }

    checkPluginExists(githubVendorPackage) {
        return this[PLUGINS].filter(p => p.github == githubVendorPackage).count() > 0
    }

    removePlugin(githubVendorPackage, done)  {
        let plugin = this[PLUGINS].filter(p => p.github == githubVendorPackage).first()

        if (plugin) {
            Utilities.rmdir(plugin.path)
            this[PLUGINS] = this[PLUGINS].filter(p => p.github != githubVendorPackage)

            this.manager.setState({
                plugins: this[PLUGINS].toArray()
            })

            return plugin
        }
        
        done()

        return false
    }

    installPlugin(github, done) {
        let directory = app.getPath("userData") + "/plugins"
        let filename = +new Date()
        let path = `${directory}/${filename}`

        let repo = `https://github.com/${github}.git`
        let exists = this.checkPluginExists(github)

        if (exists) {
            done()
            return
        }

        clone(repo, path, (err, result) => {
            if (err) {
                done()
                return
            }

            var packageInfo = JSON.parse(fs.readFileSync(`${path}/package.json`, 'utf8'))

            var plugin = {
                github,
                installedAt: +new Date(),
                name: packageInfo.name || github.split('/')[1].replace('Plugin-', ''),
                path,
                version: packageInfo.version,
                html_url: repo,
                enabled: true
            }

            this.addPlugin(plugin, done)
        })

    }

    addPlugin(plugin, cb) {
        let path = plugin.path.replace(/(\s)/, "\\ ")

        this[PLUGINS] = this[PLUGINS].push(plugin)

        exec(`cd ${path} && npm install --production`, (err, stdout, stderr) => {
            if ( ! (err || stderr)) {
                this.manager.setState({
                    plugins: this[PLUGINS].toArray()
                })
            } else {
                this[PLUGINS] = this[PLUGINS].filter(p => p.github != plugin.github)
            }

            cb(err || stderr)
        })
    }

    checkPluginsFolder() {
        fs.exists(PLUGINS_PATH, exists => ! exists ? fs.mkdir(PLUGINS_PATH) : null)
    }

}

module.exports = PluginConfig
