import username from "username"

class PersonalConfig {

    constructor(manager) {
        this.manager = manager
        this.username = username.sync()

        this.manager.userConfig(data => {
            this.username = data.get('username')
        })
    }

    defaultConfig() {
        return {
            username: username.sync()
        }
    }
}

module.exports = PersonalConfig
