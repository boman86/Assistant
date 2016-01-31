import { ipcMain as ipc } from "electron"

class StartupConfig {

    constructor(manager) {
        this.manager = manager
    }

    defaultConfig() {
        return {
            startup: [
                'help'
            ]
        }
    }
}

module.exports = StartupConfig
