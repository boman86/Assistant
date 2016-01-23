import Robot from './Robot'

const robot = new Robot()

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