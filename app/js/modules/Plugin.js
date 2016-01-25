import robot from './Robot'

class Plugin {
    constructor(name, cb) {
        this.name = name
        robot.registerPlugin(this)
        cb(robot)
        this.commands = robot.commands(this)
    }

    execute(command) {
        robot.test(this, command)
    }
}

module.exports = Plugin
