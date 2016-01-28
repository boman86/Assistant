import username from "username"

class PersonalConfig {

    constructor(manager) {
        this.manager = manager
    }

    defaultConfig() {
        return {
            username: username.sync()
        }
    }
}

module.exports = PersonalConfig
