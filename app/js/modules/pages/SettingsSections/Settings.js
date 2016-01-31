import { h } from "virtual-dom"
import { ipcRenderer as ipc } from "electron"

module.exports = stateHelper => {
    return {
        icon: 'fa-cog',
        title: 'Settings',
        initialize() {
            var config = ipc.sendSync('get-user-config')

            stateHelper.set({ config })
        },
        contents() {
            return h('div', {}, [
                h('h3', {}, [
                    `Username: ${stateHelper.get('config').get('username')}`
                ])
            ])
        }
    }
}
