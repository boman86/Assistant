import Immutable from 'Immutable'
import execall from 'execall'
import h from "hyperscript"
import Event from "./Event"

const Observers = Symbol()

class Robot {

    constructor() {
        this[Observers] = Immutable.List([])
        this.Immutable = Immutable
        this.on = Event.on
        this.fire = Event.fire
        this.h = h
    }

    spawnCard(hObj) {
        window.cards.spawn(hObj)
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

module.exports = Robot