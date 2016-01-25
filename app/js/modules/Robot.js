import Immutable from 'Immutable'
import execall from 'execall'
import { h } from "virtual-dom"
import Event from "./Event"

const Observers = Symbol()

class Robot {
    constructor() {
        this[Observers] = Immutable.List([])

        this.Event = Event
        this.h = h
        this.Immutable = Immutable

        this.currentPlugin = null

        this.voices = []
        this.voice = null

        this.loadVoices()
    }

    registerPlugin(p) {
        this[Observers] = this[Observers].push(
            Immutable.Map({
                name: p.name,
                commands: Immutable.List([])
            })
        )

        this.currentPlugin = p
    }

    fetchJson(url) {
        return fetch(url).then(res => res.json())
    }

    on(event, cb) {
        Event.on(event, cb)
    }

    fire(event, data) {
        Event.fire(event, data)
    }

    spawnCard(type, data) {
        return window.cards.spawn(type, data)
    }

    setVoice(voice) {
        this.voice = voice
    }

    userSaid(str, s) {
		return str.indexOf(s) > -1;
	}

    hear(text, cb) {
        console.log("test")
        var confidenceThreshold = 0.3
        var recognition = new webkitSpeechRecognition()

        if (typeof text === "string") {
            text = [text]
        }

        recognition.continuous = true
		recognition.interimResults = false
		recognition.lang = 'en'

        recognition.onresult = event => {
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    if (parseFloat(event.results[i][0].confidence) >= parseFloat(confidenceThreshold)) {
                        var str = event.results[i][0].transcript;
                        for (var i = 0; i < text.length; i++) {
                            if (this.userSaid(str, text[i])) {
                                cb(str)
                            }
                        }
                    }
                }
            }
        }

        recognition.start()
    }

    speak(msg, opts) {
        msg = new SpeechSynthesisUtterance(msg)
        msg.voice = this.voice

        for (var key in opts) {
            msg[key] = opts[key]
        }

        window.speechSynthesis.speak(msg)
    }

    listen(regex, description, cb) {
        let p = this[Observers].filter(o => o.get('name') == this.currentPlugin.name).first()
        p = p.set('commands', p.get('commands').push({
            regex, description, cb
        }))

        this[Observers] = this[Observers].map(o => {
            if (o.get('name') == this.currentPlugin.name) {
                return p
            } else {
                return o
            }
        })
    }

    test(plugin, command) {
        this[Observers]
            .filter(o => o.get('name') == plugin.name)
            .first()
            .get('commands')
            .filter(o => o.regex.test(command))
            .forEach(o => o.cb({
                command,
                matches: o.regex.exec(command)
            }))
    }

    commands(plugin) {
        return this[Observers]
            .filter(o => o.get('name') == plugin.name)
            .first()
            .get('commands')
            .map(o => {
                return {
                    name: o.regex,
                    description: o.description
                }
            })
    }

    loadVoices() {
        var voicesInterval = setInterval(() => {
            this.voices = speechSynthesis.getVoices().filter(s => s.lang == "en-US" && s.localService == true)

            if (this.voices.length > 0){
                this.voice = this.voices[0]
                clearInterval(voicesInterval)
            }
        }, 100)
    }
}

module.exports = new Robot()
