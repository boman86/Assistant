class Socket {
    constructor(host, port) {
        this.host = host
        this.port = port

        this.callbacks = {}
    }

    start(cb) {
        this.socket = new WebSocket(`ws://${this.host}:${this.port}/`)

        this.socket.onopen = () => {
            let command = ["SUBSCRIBE"]

            Object.keys(this.callbacks).forEach(channel => command.push(channel))

            if (command.length > 1)
                this.socket.send(JSON.stringify(command))
        }

        this.socket.onclose = () => {
            setTimeout(() => {
                this.start()
            }, 1500)
        }

        this.socket.onmessage = (e) => {
            let data = JSON.parse(e.data)['SUBSCRIBE']
            let event = data[0],
                channel = data[1],
                message = data[2];

            if (event == 'message') {
                this.dispatchEvents(channel, message)
            }

            return this
        }

        if (typeof cb == "function") {
            cb()
        }
    }

    dispatchEvents(channel, message) {
        var json

        try {
            json = JSON.parse(message)
        } catch(ex) {
            json = message
        }

        this.callbacks[channel](channel, json)
    }

    subscribe(channel, callback) {
        this.callbacks[channel] = callback

        if(this.socket && this.socket.readyState == 1) {
            let ttl = this.callbacks.length * 10;
            setTimeout(() => {
                this.socket.send(JSON.stringify(['SUBSCRIBE', channel]))
            }, ttl)
        }
    }
}

module.exports = (host, port) => new Socket(host, port)
