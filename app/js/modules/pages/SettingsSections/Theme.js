import { h } from "virtual-dom"
import { List } from "Immutable"
import { ipcRenderer as ipc } from "electron"

var chooseTheme = color => {
    ipc.send("change-theme", color)
}

const COLORS = [
    'amber', 'blue-grey', 'blue', 'brown', 'cyan',
    'deep-orange', 'deep-purple', 'green', 'grey',
    'indigo', 'light-blue', 'light-green', 'lime',
    'orange', 'pink', 'purple', 'red', 'teal',
    'yellow'
]

module.exports = {
    icon: 'fa-paint-brush',
    title: 'Themes',
    contents() {
        return h('.theme-chooser', {}, [
            h('h3', "Choose Your Theme"),
            h('.current.background-theme', {}, [
                h('span.fa.fa-paint-brush.text-theme-200')
            ]),
            h('ul', {}, List(COLORS).map(color => {
                return h(`li.background-${color}`, {
                    onclick: () => chooseTheme(color)
                })
            }).toArray())
        ])
    }
}
