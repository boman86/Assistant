import fs from "fs"
import path from "path"
import Immutable from 'immutable'
import Plugin from './Plugin'
import Event from './Event'

const plugins = Symbol()

class PluginManager {

    constructor() {
        this[plugins] = Immutable.List([])

        Event.on("plugins:execute", command => this.execute(command))
        Event.on('plugins:fetch_plugin_list', cb => cb(this.list()))
        Event.on('plugins:remove_plugin', plugin => this.remove(plugin.name))
        Event.on('plugins:register_plugin', plugin => {
            try {
                this.register(plugin.name, require(plugin.path))
                Event.fire("notification:success", `Succesfully registered ${plugin.name} plugin!`)
            } catch(e) {
                Event.fire("notification:error", `Could not load plugin ${plugin.name}`)
            }
        })
    }

    loadFrom(dir) {
        fs.readdir(dir, (err, files) => {
            if ( ! err) {
                files.forEach(file => {
                    var fileName = path.basename(file, '.js')
                    this.register(fileName, require(`${dir}/${fileName}`))
                })
            }
        })
    }

    register(name, cb) {
        this[plugins] = this[plugins].push(new Plugin(name, cb))
    }

    remove(name) {
        this[plugins] = this[plugins].filter(p => p.name != name)
    }

    execute(command) {
        this[plugins].forEach(plugin => plugin.execute(command))
    }

    list() {
        return this[plugins]
    }
}

module.exports = new PluginManager()
