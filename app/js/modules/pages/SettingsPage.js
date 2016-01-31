import { List, Map } from "Immutable"
import { h, patch, diff, create } from "virtual-dom"
import { v4 as uuid } from "uuid"
import StateMachine from "../../StateMachine"

import ThemeSection from "./SettingsSections/Theme"
import InstallSection from "./SettingsSections/Install"
import SettingsSection from "./SettingsSections/Settings"
import PluginSection from "./SettingsSections/Plugin"
import KeyboardSection from "./SettingsSections/Keyboard"

const list = [
    InstallSection,
    PluginSection,
    SettingsSection,
    ThemeSection,
    KeyboardSection,
]

const SECTIONS = Symbol()
const ACTIVE = Symbol()
const RootNode = Symbol()
const OUTPUT = Symbol()

class SettingsPage {

    constructor(placeholder) {
        /* Init: Virtual DOM */
        this[OUTPUT] = placeholder

        this.oldTree = h('div')
        this[RootNode] = create(this.oldTree)
        this[OUTPUT].appendChild(this[RootNode])

        this[SECTIONS] = List([])
        this[ACTIVE] = Map({})
    }

    addSection(component) {
        if (typeof component == "function") {
            var state = Map({})

            var stateMachine = new StateMachine(() => {
                this.render()
            })

            component = component(stateMachine)
        }

        var section = Map({
            icon: component.icon,
            title: component.title,
            contents: component.contents,
            data: component.data || {},
            initialize: component.initialize || function() {},
            id: uuid()
        })

        if (this[SECTIONS].isEmpty()) {
            this[ACTIVE] = section.get('id')
        }

        section.get('initialize')()

        this[SECTIONS] = this[SECTIONS].push(section)

        this.render()
    }

    setActiveSection(section) {
        this[ACTIVE] = section.get('id')

        this.render()
    }

    render() {
        let active = this[SECTIONS].filter(sections => sections.get('id') === this[ACTIVE]).first()

        var newTree = h('div', {}, [
            h('.Settings__title', {}, [
                h(`span.fa.${active.get('icon')}.breathing.text-theme-700`),
                h('span.text-theme-900', active.get('title'))
            ]),
            h('ul.sidebar', {}, this[SECTIONS].map(section => {
                return h('li', {
                    className: section.get('id') === this[ACTIVE] && "active",
                    onclick: () => this.setActiveSection(section)
                }, [
                    h(`span.fa.${section.get('icon')}`),
                    h('span', ` ${section.get('title')}`)
                ])
            }).toArray()),
            h('.content', {}, [active.get('contents')()])
        ])

        /** Starting Virtual DOM Magic */
        let patches = diff(this.oldTree, newTree)
        this[RootNode] = patch(this[RootNode], patches)
        this.oldTree = newTree
        /** Ending Virtual DOM Magic */
    }
}

const page = new SettingsPage(document.getElementById("output"))
list.forEach(item => page.addSection(item))

window.onbeforeunload = e => {
    ipc.send('show-main-window')
}

module.exports = page
