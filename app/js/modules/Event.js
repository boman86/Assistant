import Immutable from "Immutable"

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
}

module.exports = new Event()