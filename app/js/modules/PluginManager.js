import Immutable from 'immutable'
import Plugin from './Plugin'

const plugins = Symbol()

class PluginManager {

    constructor() {
        this[plugins] = Immutable.List([])
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