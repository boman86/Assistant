import Immutable from 'Immutable'
import execall from 'execall'
import h from "hyperscript"

const Observers = Symbol()

class Robot {

    constructor() {
        this[Observers] = Immutable.List([])
    }

    h(tag, attrs, children) {
        return h(tag, attrs, children)
    }

    spawnCard(hObj) {
        window.cards.spawn(hObj)
    }

    clearScreen() {
        window.cards.clear()
    }

    listen(regex, description, cb) {
        this[Observers] = this[Observers].push({
            regex, description, cb
        })
    }

    test(command) {
        this[Observers]
            .filter(o => o.regex.test(command))
            .forEach(o => o.cb({
                command,
                matches: execall(o.regex, command)
            }))
    }

    commands() {
        return this[Observers].map(o => {
            return {
                name: o.regex,
                description: o.description
            }
        })
    }
}

export default Robot