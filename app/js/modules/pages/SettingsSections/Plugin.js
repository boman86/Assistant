import { h } from "virtual-dom"
import { List } from "Immutable"
import { ipcRenderer as ipc } from "electron"
import fs from "fs"

var fetchPlugins = cb => {
    var config = ipc.sendSync('get-user-config')

    cb(config.plugins)
}

var renderButton = p => {
    return h('div.button-group.right', {}, [
            h('button.button--theme', {
                // disabled: this.loading[p.full_name],
                // onclick: (e) => this.uninstall(p.full_name)
            }, [
                h('span.fa.fa-trash-o'),
                h('span', {}, 'Remove')
            ]),
            p.enabled
            ? h('button.button--theme', {
                    // disabled: this.loading[p.full_name],
                    // onclick: (e) => this.uninstall(p.full_name)
                }, [
                    h('span.fa.fa-pause'),
                    h('span', {}, 'Disable')
                ])
            : h('button.button--theme', {
                    // disabled: this.loading[p.full_name],
                    // onclick: (e) => this.uninstall(p.full_name)
                }, [
                    h('span.fa.fa-play'),
                    h('span', {}, 'Enable')
                ])
        ])
}

var renderItem = p => {
    return h('div', {}, [
        renderButton(p),
        // h('img.left', {
        //     src: p.owner.avatar_url,
        //     style: { width: '30px' }
        // }),

        h('a.breathing', {
            href: p.html_url
        }, p.name),
        h('span.breathing.cursor--default', {}, [
            `v${p.version}`
        ])
    ])
}

module.exports = stateHelper => {
    return {
        icon: 'fa-plug',
        title: 'Plugins',
        initialize() {
            fetchPlugins(plugins => {
                stateHelper.set({ plugins: List(plugins) })
            })
        },
        contents() {
            var plugins = stateHelper.get('plugins', List([]))

            return h('div', {}, [
                h('h3.cursor--default', `Installed Plugins (${plugins.count()})`),
                h('ul.card--list', plugins.map(p => h('li.card--list__item', renderItem(p))).toArray())
            ])
        }
    }
}
