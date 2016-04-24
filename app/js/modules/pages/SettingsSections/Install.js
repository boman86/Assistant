import { ipcRenderer as ipc } from "electron"
import { h } from "virtual-dom"
import { List, Map, fromJS } from "Immutable"

const BASE = "https://api.github.com"
const ORG = "PersonalAssistant"

var setLoading = (plugin, loading, state) => {
    var full_name = plugin.get('full_name')

    var plugins = state.get('plugins').map(p => {
        if (p.get('full_name') == full_name) {
            return p.set('loading', true)
        } else {
            return p
        }
    })

    state.set({ plugins })
}

var install = (plugin, state) => {
    setLoading(plugin, true, state)

    ipc.send('install-plugin', plugin.get('full_name'))
}

var uninstall = (plugin, state) => {
    setLoading(plugin, true, state)

    ipc.send('remove-plugin', plugin.get('full_name'))
}

var fetchPlugins = cb => {
    fetch(`${BASE}/orgs/${ORG}/repos`)
        .then(res => res.json())
        .then(data => cb(data))
}

var renderButtons = (plugin, state) => {
    let installed = ipc.sendSync('check-plugin-exists', plugin.get('full_name'))

    return installed
        ? h('button.button.button--red.right', {
            disabled: plugin.get('loading', false),
            onclick: (e) => uninstall(plugin, state)
        }, [
            plugin.get('loading', false) ? h('span.fa.fa-spinner.fa-pulse') : h('span.fa.fa-trash-o'),
            plugin.get('loading', false) ? h('span', 'Removing') : h('span', 'Remove')
        ])
        : h('button.button--theme.right', {
            disabled: plugin.get('loading', false),
            onclick: (e) => install(plugin, state)
        }, [
            plugin.get('loading', false) ? h('span.fa.fa-spinner.fa-pulse') : h('span.fa.fa-download'),
            plugin.get('loading', false) ? h('span', "Installing") : h('span', 'Install')
        ])
}

var renderItem = (plugin, state) => {
    return h('div', {}, [
        renderButtons(plugin, state),
        h('img.left.img-30.avatar', {
            src: plugin.get('owner').get('avatar_url')
        }),
        h('a.breathing', {
            href: plugin.get('html_url')
        }, plugin.get('name'))
    ])
}

module.exports = state => {
    return {
        icon: 'fa-download',
        title: 'Install',
        initialize() {
            fetchPlugins(plugins => {
                plugins = List(plugins).map(plugin => fromJS(plugin).set('loading', false))
                state.set({ plugins })
            })
        },
        contents() {
            var plugins = state.get('plugins', List([]))

            return h('div', {}, [
                h('h3.cursor--default', `${ORG} available plugins (${plugins.count()})`),
                h('ul.card--list', plugins.map(plugin => h('li.card--list__item', renderItem(plugin, state))).toArray())
            ])
        }
    }
}
