import Event from "./Event"
import h from "hyperscript"
import Immutable from "Immutable"

const Notifications = Symbol()
const NotificationsIndex = Symbol()

class NotificationManager {

    constructor(outputEl) {
        this[output] = outputEl
        this.setNotifications(Immutable.List([]))

        Event.on('notification:error', msg => this.error(msg))
        Event.on('notification:info', msg => this.info(msg))
        Event.on('notification:success', msg => this.success(msg))
        Event.on('notification:warning', msg => this.warning(msg))

        Event.on('notification:previous', () => this.previous())
        Event.on('notification:next', () => this.next())

        Event.on('notification:fetch_notification_list', () => {
            Event.fire('notification:notification_list', this.history())
        })
    }

    setNotifications(list) {
        this[Notifications] = list
        this[NotificationsIndex] = this[Notifications].count() - 1

        this.draw()
    }

    draw() {
        var notification = this[Notifications].get(this[NotificationsIndex])

        if (notification) {
            this[output].innerHTML = notification.outerHTML

            setTimeout(() => {
                this[output].innerHTML = ""
            }, 5000)
        }
    }

    previous() {
        this[NotificationsIndex] = Math.max(0, this[NotificationsIndex] - 1)
        this.draw()
    }

    next() {
        this[NotificationsIndex] = Math.min(this[Notifications].count() - 1, this[NotificationsIndex] + 1)
        this.draw()
    }

    history() {
        return {
            items: this[Notifications],
            total: this[Notifications].count(),
            counter: this[NotificationsIndex]
        }
    }

    notify(msg, type, icon) {
        this.setNotifications(this[Notifications].push(
            h(`.notifications__notification.notifications__notification--${type}`, {}, [
                h(`span.fa.${icon}`),
                h('span', msg)
            ])
        ))
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