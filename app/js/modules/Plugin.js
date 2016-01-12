import Robot from './Robot'

class Plugin {
    constructor(name, cb) {
        this.name = name
        this.robot = new Robot()
        cb(this.robot)
        this.commands = this.robot.commands()
    }

    execute(command) {
        this.robot.test(command)
    }
}

module.exports = Plugin