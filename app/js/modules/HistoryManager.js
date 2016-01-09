import Immutable from 'immutable'

const history = Symbol()
const historyIndex = Symbol()
const localStorageKey = "__history"

class HistoryManager {
    constructor() {
        this[history] = Immutable.List([])
        this[historyIndex] = 0

        var json = localStorage.getItem(localStorageKey)

        if (json) {
            this.fromJson(json)
        }
    }

    push(item) {
        item = item.trim()

        if ( ! item) return

        this[history] = this[history].push(Immutable.Map({ command: item }))
        this[historyIndex] = this[history].count() - 1

        this.persist()
    }

    forward() {
        this[historyIndex] = Math.min(this[history].count(), ++this[historyIndex])

        let next = this[history].get(this[historyIndex])

        return next ? next.toJSON() : null
    }

    backward() {
        let previous = this[history].get(Math.max(0, this[historyIndex]))

        this[historyIndex] = Math.max(0, --this[historyIndex])

        return previous ? previous.toJSON() : null
    }

    history() {
        let items = this[history].map(e => e.toObject())
        let total = this[history].count()

        return {
            items,
            total,
            counter: this[historyIndex]
        }
    }

    count() {
        return this[history].count()
    }

    clear() {
        this[history] = this[history].clear()

        this.persist()
    }

    persist() {
        localStorage.setItem(localStorageKey, this.toJson())
    }

    toJson() {
        return JSON.stringify(this[history].toJSON())
    }

    fromJson(json) {
        if (typeof json == "string") {
            json = JSON.parse(json)
        }

        this[history] = Immutable.List(json).map(obj => Immutable.Map(obj))
        this[historyIndex] = this[history].count() - 1
    }
}

module.exports = new HistoryManager()