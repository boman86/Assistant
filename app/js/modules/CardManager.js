import Immutable from "Immutable"
import { h, diff, patch, create } from "virtual-dom"
import Event from "./Event"
import { v4 as uuid } from "uuid"

const OUTPUT = Symbol()
const Cards = Symbol()
const Types = Symbol()
const RootNode = Symbol()
const CardsHistory = Symbol()
const CardsHistoryIndex = Symbol()

class CardManager {

    constructor(output, undoEl, redoEl) {
        this[OUTPUT] = output
        this[Cards] = Immutable.List([])
        this[CardsHistory] = Immutable.List([])
        this[CardsHistoryIndex] = this[CardsHistory].count() - 1

        this[Types] = Immutable.List([])

        // Ready for some Virtual Dom?
        this.oldTree = h('div')
        this[RootNode] = create(this.oldTree)
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
        this[CardsHistory] = this[CardsHistory].push(cards)
        this[CardsHistoryIndex] = this[CardsHistory].count() - 1
        this.render()
    }

    registerCard(card) {
        card = card(h, Immutable) // Give h & Immutable

        var type = Immutable.Map({ type: card.type, card })

        this[Types] = this[Types].push(type)
    }

    spawn(type, render, id = false) {
        var card = Immutable.Map({
            id: id ? id : uuid(),
            rendered: this[Types].filter(c => c.get('type') == type).first().get('card').cb(render),
            type,
            data: render
        })

        this[Cards] = this[Cards].push(card)
        var items = !!! this[CardsHistory].last() ? Immutable.List([]) : this[CardsHistory].last()
        this.setCards(items.push(card.get('id')))

        return card.get('id')
    }

    update(id, render) {
        var card = this[Cards].find(c => c.get('id') == id)

        var index = this[Cards].findIndex(c => c.get('id') == id)
        var type = card.get('type')

        this[Cards] = this[Cards].update(index, card => {
            return card.set('rendered', this[Types].filter(c => c.get('type') == type).first().get('card').cb(render))
        })

        this.render()
    }

    clear() {
        if (this[CardsHistory].last().count() > 0) { // Only when it has cards
            this.setCards(Immutable.List([]))
        } else {
            this[CardsHistoryIndex] = this[CardsHistory].count() - 1
            this.render()
        }

        Event.fire('notification:success', "I cleared the screen for you, you're welcome ;)")
    }

    undo() {
        this[CardsHistoryIndex] = Math.max(0, this[CardsHistoryIndex] - 1)
        this.render()
    }

    redo() {
        this[CardsHistoryIndex] = Math.min(this[CardsHistory].count() - 1, this[CardsHistoryIndex] + 1)
        this.render()
    }

    render() {
        let list = this[CardsHistory].get(this[CardsHistoryIndex]).map(id => {
            return this[Cards].find(item => item.get('id') == id).get('rendered')
        }).reverse().toArray()

        let newTree = h('div', {}, list)

        /** Starting Virtual DOM Magic */
        let patches = diff(this.oldTree, newTree)
        this[RootNode] = patch(this[RootNode], patches)
        this.oldTree = newTree
        /** Ending Virtual DOM Magic */

        var hasUndo = this[CardsHistoryIndex] !== 0
        var hasRedo = this[CardsHistoryIndex] !== this[CardsHistory].count() - 1

        this.undoEl.disabled = hasUndo ? '' : 'disabled'
        this.redoEl.disabled = hasRedo ? '' : 'disabled'
    }
}

module.exports = (output, undoEl, redoEl) => new CardManager(output, undoEl, redoEl)
