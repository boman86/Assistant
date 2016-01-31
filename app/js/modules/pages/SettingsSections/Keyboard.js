import { h } from "virtual-dom"

module.exports = stateHelper => {
    return {
        icon: 'fa-keyboard-o',
        title: 'Keybindings',
        contents() {
            return h('h3', {}, [
                'Keyboard...'
            ])
        }
    }
}
