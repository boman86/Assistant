import Immutable from "Immutable"
import Event from "./Event"

const RECOGNITION = new webkitSpeechRecognition()
const OBSERVERS = Symbol()
const SOUNDBAR = Symbol()

class SpeechRecognition {
    constructor() {
        this[OBSERVERS] = Immutable.List([])

        this.confidence = 0.3
        RECOGNITION.continuous = true
        RECOGNITION.interimResults = true
        this.started = false

        RECOGNITION.onstart = () => this.started = true
        RECOGNITION.onresult = event => this.parseResults(event)
        this.level = 0
        this.intervalId = null
        this[SOUNDBAR] = document.getElementById('soundbar')
    }

    start() {
        if ( ! this.started && this[OBSERVERS].size > 0) {
            RECOGNITION.start()
            this.started = true
        }
    }

    userSaid(regex, str) {
		return regex.test(str)
	}

    setLevel(delta) {
        this.level += delta
        this.level = Math.max(0, Math.min(100, this.level))
        this[SOUNDBAR].style.width = `${this.level}%`
    }

    parseResults(event) {
        this.setLevel(+10)

        clearInterval(this.intervalId)

        for (var i = event.resultIndex; i < event.results.length; ++i) {
            if (parseFloat(event.results[i][0].confidence) >= parseFloat(this.confidence)) {
                var str = event.results[i][0].transcript.trim();
                Event.fire("notification:info", `${userConfig.username} is saying: ${str}`)
                this[OBSERVERS].forEach(o => {
                    o.get('regex').forEach(regex => {
                        if (this.userSaid(regex, str)) {
                            o.get('cb')({
                                str,
                                regex,
                                matches: regex.exec(str)
                            })
                        }
                    })
                })
            }

            if (event.results[i].isFinal) {
                this.intervalId = setInterval(() => {
                    this.setLevel(-10)

                    if (this.level <= 0) {
                        clearInterval(this.intervalId)
                    }
                }, 200)
            }
        }
    }

    listenFor(regex, cb) {
        this[OBSERVERS] = this[OBSERVERS].push(Immutable.Map({
            regex: [].concat(regex),
            cb
        }))
        this.start()
    }

}

module.exports = new SpeechRecognition()
