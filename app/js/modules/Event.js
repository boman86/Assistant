import Immutable from "Immutable"
import WS from "./_ws"

const Events = Symbol()

class Event {
    constructor() {
        this[Events] = Immutable.Map({})
    }

    on(event, cb) {
        this[Events] = this[Events].set(event, this[Events].get(event, Immutable.List([])).push(Immutable.Map({ cb })))
    }

    fire(event, data) {
        this[Events].get(event, Immutable.List([])).forEach(item => item.get('cb')(data))
    }

    onSocket(channel) {
        WS.subscribe(channel, (data, channel) => this.fire(channel, data))
    }
}

module.exports = new Event()
