import { Map } from "Immutable"

class StateMachine {
    constructor(cb) {
        this.cb = cb
        this.state = Map({})
    }

    set(newState) {
        var res = this.state.merge(newState)

        if (this.state != res) {
            this.state = res
            setTimeout(() => this.cb(this.state))
        }
    }

    get(key, defaultValue) {
        return this.state.get(key, defaultValue)
    }
}

module.exports = StateMachine
