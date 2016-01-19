import Immutable from 'Immutable'
import execall from 'execall'
import { h } from "virtual-dom"
import Event from "./Event"

const Observers = Symbol()

class Robot {

    constructor() {
        this[Observers] = Immutable.List([])

        this.Event = Event
        this.h = h
        this.Immutable = Immutable
    }

    on(event, cb) {
        Event.on(event, cb)
    }

    fire(event, data) {
        Event.fire(event, data)
    }

    spawnCard(type, data) {
        return window.cards.spawn(type, data)
    }

    speak(msg, opts) {
        msg = new SpeechSynthesisUtterance(msg)

        for (var key in opts) {
            switch (key) {
                case "voice":
                    msg.voice = speechSynthesis.getVoices().filter(v => v.name.toLowerCase() == opts[key].toLowerCase())[0]
                    break;
                default:
                    msg[key] = opts[key]
                    break;
            }
        }

        window.speechSynthesis.speak(msg)
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