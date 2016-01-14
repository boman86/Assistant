import Immutable from "Immutable"
import { h, diff, patch, create } from "virtual-dom"
import Event from "./Event"

const OUTPUT = Symbol()
const Cards = Symbol()
const CardsIndex = Symbol()
const RootNode = Symbol()

class CardManager {

    constructor(output, undoEl, redoEl) {
        this[OUTPUT] = output
        this[Cards] = Immutable.List([])
        this[Cards] = this[Cards].push(Immutable.List([]))
        this[CardsIndex] = this[Cards].count() - 1

        // Ready for some Virtual Dom?
        this[RootNode] = create(h('div'))
        this[OUTPUT].appendChild(this[RootNode])

        this.undoEl = undoEl
        this.redoEl = redoEl

        undoEl.addEventListener('click', e => this.undo())
        redoEl.addEventListener('click', e => this.redo())

        Event.on('history:undo', () => this.undo())
        Event.on('history:redo', () => this.redo())
        Event.on('clear', () => this.clear())
        Event.on('clear:screen', () => this.clear())
    }

    setCards(cards) {
        this[Cards] = this[Cards].push(cards)
        this[CardsIndex] = this[Cards].count() - 1
        this.draw()
    }

    spawn(hObj) {
        this.setCards(this[Cards].last().push(h('.card', hObj)))
    }

    clear() {
        if (this[Cards].last().count() > 0) { // Only when it has cards
            this.setCards(Immutable.List([]))
        } else {
            this[CardsIndex] = this[Cards].count() - 1
            this.draw()
        }
        Event.fire('notification:success', "I cleared the screen for you, you're welcome ;)")
    }

    draw() {
        /** Starting Virtual DOM Magic */
        let list = h('div', {}, this[Cards].get(this[CardsIndex]).reverse().toArray())
        let patches = diff(this[RootNode], list)
        this[RootNode] = patch(this[RootNode], patches)
        /** Ending Virtual DOM Magic */

        var hasUndo = this[CardsIndex] !== 0
        var hasRedo = this[CardsIndex] !== this[Cards].count() - 1

        this.undoEl.disabled = hasUndo ? '' : 'disabled'
        this.redoEl.disabled = hasRedo ? '' : 'disabled'
    }

    undo() {
        this[CardsIndex] = Math.max(0, this[CardsIndex] - 1)
        this.draw()
    }

    redo() {
        this[CardsIndex] = Math.min(this[Cards].count() - 1, this[CardsIndex] + 1)
        this.draw()
    }
}

module.exports = (output, undoEl, redoEl) => new CardManager(output, undoEl, redoEl)