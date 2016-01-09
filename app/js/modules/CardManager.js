import Immutable from "Immutable"
import h from "hyperscript"

const OUTPUT = Symbol()
const Cards = Symbol()

class CardManager {

    constructor(output) {
        this[OUTPUT] = output
        this[Cards] = Immutable.List([])
    }

    spawn(hObj) {
        this[OUTPUT].insertBefore(h('.card', hObj), this[OUTPUT].firstChild)
    }

    clear() {
        this[OUTPUT].innerHTML = ""
    }
}

module.exports = output => new CardManager(output)