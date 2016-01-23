import fs from "fs"
import Immutable from 'immutable'
import Plugin from './Plugin'
import Event from './Event'

const plugins = Symbol()

class PluginManager {

    constructor() {
        this[plugins] = Immutable.List([])

        Event.on('plugins:fetch_plugin_list', cb => cb(this.list()))
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