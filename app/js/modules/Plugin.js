import Robot from './Robot'

class Plugin {
    constructor(name, cb) {
        this.name = name
        this.robot = new Robot()
        this.cb = cb;
        this.cb(this.robot)
        this.commands = this.robot.commands()
    }

    execute(command) {
        this.robot.test(command)
    }
}

module.exports = Plugin