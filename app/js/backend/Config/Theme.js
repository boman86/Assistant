import { ipcMain as ipc } from "electron"

const COLORS = [
    'amber', 'blue-grey', 'blue', 'brown', 'cyan',
    'deep-orange', 'deep-purple', 'green', 'grey',
    'indigo', 'light-blue', 'light-green', 'lime',
    'orange', 'pink', 'purple', 'red', 'teal',
    'yellow'
]

class ThemeConfig {

    constructor(manager) {
        this.manager = manager
        this.themeColor = null
        this.manager.userConfig(data => {
            this.themeColor = data.get('themeColor')
        })
        ipc.on('change-theme', (event, color) => this.changeTheme(color))
    }

    defaultConfig() {
        return {
            themeColor: 'indigo'
        }
    }

    changeTheme(color) {
        var found = false

        for (var i = 0; i < COLORS.length; i++) {
            if (color == COLORS[i]) {
                found = true
                break;
            }
        }

        if (found && color != this.themeColor) {
            this.manager.setState({
                themeColor: color
            })
            this.themeColor = color
            this.manager.notifyWindows('changed-theme', color)
        }
    }

}

module.exports = ThemeConfig
