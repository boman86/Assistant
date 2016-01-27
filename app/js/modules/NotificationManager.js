import Event from "./Event"
import { h, diff, patch, create } from "virtual-dom"
import debounce from "debounce"

const Notification = Symbol()
const RootNode = Symbol()

class NotificationManager {

    constructor(outputEl) {
        this[output] = outputEl
        this[Notification] = h('div')

        // Ready for some Virtual Dom?
        this.oldNode = h('div')
        this[RootNode] = create(this.oldNode)
        this[output].appendChild(this[RootNode])

        Event.on('notification:error', msg => this.error(msg))
        Event.on('notification:info', msg => this.info(msg))
        Event.on('notification:success', msg => this.success(msg))
        Event.on('notification:warning', msg => this.warning(msg))

        this.clearNotification = debounce(this._clearNotification, 5000)
    }

    setNotification(notification) {
        this[Notification] = notification
        this.draw()

        this.clearNotification()
    }

    _clearNotification() {
        this[Notification] = h()
        this.draw()
    }

    draw() {
        /** Starting Virtual DOM Magic */
        let patches = diff(this.oldNode, this[Notification])
        this[RootNode] = patch(this[RootNode], patches)
        this.oldNode = this[Notification]
        /** Ending Virtual DOM Magic */
    }

    notify(msg, type, icon) {
        this.setNotification(
            h(`.notifications__notification.notifications__notification--${type}`, {}, [
                h(`span.fa.${icon}`),
                h('span', msg),
                h('button.close', { onclick: () => this._clearNotification() }, [
                    h('span.fa.fa-times.fa-lg')
                ])
            ])
        )
    }

    success(msg) {
        this.notify(msg, 'success', 'fa-check')
    }

    error(msg) {
        this.notify(msg, 'error', 'fa-times-circle')
    }

    info(msg) {
        this.notify(msg, 'info', 'fa-info-circle')
    }

    warning(msg) {
        this.notify(msg, 'warning', 'fa-warning')
    }
}

module.exports = outputEl => new NotificationManager(outputEl)
