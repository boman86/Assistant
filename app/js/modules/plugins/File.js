import fs from "fs"

module.exports = robot => {
    const h = robot.h
    const Immutable = robot.Immutable

    robot.listen(/read (.*)/, "Read a file", res => {

        var files = Immutable.List(res.matches[0].sub[0].split(/[\s,]+/))

        files.forEach(file => {
            fs.readFile(file, 'utf8', (err, contents) => {
                if ( ! err) {
                    robot.spawnCard('editor', contents)
                }
            })
        })
    })
}