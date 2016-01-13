import fs from "fs"
import Immutable from 'immutable'
import Plugin from './Plugin'
import Event from './Event'

const plugins = Symbol()

class PluginManager {

    constructor() {
        this[plugins] = Immutable.List([])

        Event.on('plugins:fetch_plugin_list', () => {
            Event.fire('plugins:plugin_list', this.list())
        })
    }

    loadFrom(dir) {
        Immutable.List(fs.readdirSync(dir)).forEach(file => {
            let name = file.replace('.js', '')

            this.register(name, require(dir + '/' + file))
        })
    }

    register(name, cb) {
        this[plugins] = this[plugins].push(new Plugin(name, cb))
    }

    execute(command) {
        this[plugins].forEach(plugin => plugin.execute(command))
    }

    list() {
        return this[plugins]
    }
}

module.exports = new PluginManager()