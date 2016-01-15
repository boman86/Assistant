import Immutable from 'immutable'
import Event from './Event'

const History = Symbol()
const Storage = Symbol()
const HistoryIndex = Symbol()
const localStorageKey = "__history"

class HistoryManager {
    constructor(storageMechanism) {
        this[Storage] = storageMechanism || localStorage
        this[History] = Immutable.List([])
        this[HistoryIndex] = 0

        var json = this[Storage].getItem(localStorageKey)

        if (json) {
            this.fromJson(json)
        }

        Event.on('history:clear', () => this.clear())
        Event.on('history:fetch_history_list', () => {
            Event.fire('history:history_list', this.history())
        })
    }

    push(item) {
        item = item.trim()

        if ( ! item) return

        this[History] = this[History].push(Immutable.Map({ command: item }))
        this[HistoryIndex] = this[History].count() - 1

        this.persist()
    }

    forward() {
        this[HistoryIndex] = Math.min(this[History].count(), ++this[HistoryIndex])

        let next = this[History].get(this[HistoryIndex])

        return next ? next.toJSON() : null
    }

    backward() {
        let previous = this[History].get(Math.max(0, this[HistoryIndex]))

        this[HistoryIndex] = Math.max(0, --this[HistoryIndex])

        return previous ? previous.toJSON() : null
    }

    history() {
        let items = this[History].map(e => e.toObject())
        let total = this[History].count()

        return {
            items,
            total,
            counter: this[HistoryIndex]
        }
    }

    count() {
        return this[History].count()
    }

    clear() {
        this[History] = this[History].clear()
        Event.fire('notification:success', 'I cleaned your history, it was kind of messy...')

        this.persist()
    }

    persist() {
        this[Storage].setItem(localStorageKey, this.toJson())
    }

    toJson() {
        return JSON.stringify(this[History].toJSON())
    }

    fromJson(json) {
        if (typeof json == "string") {
            json = JSON.parse(json)
        }

        this[History] = Immutable.List(json).map(obj => Immutable.Map(obj))
        this[HistoryIndex] = this[History].count() - 1
    }
}

module.exports = storage => new HistoryManager(storage)