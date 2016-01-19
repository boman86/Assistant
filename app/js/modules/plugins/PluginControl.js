import clone from "git-clone"
import { app } from "remote"
import fs from "fs"
import { ipcRenderer as ipc } from "electron"

module.exports = robot => {

    robot.listen(/^remove plugin (.*)$/, "Remove a plugin", res => {

    })

    robot.listen(/^install plugin (.*) ?(.*)?$/, "Install a plugin from github", res => {
        let github = res.matches[0].sub[0]
        let branchOrTag = res.matches[0].sub[1] || "master"

        let directory = app.getPath("userData") + "/plugins"
        let filename = +new Date()
        let path = `${directory}/${filename}`

        let repo = `https://github.com/${github}.git`
        let exists = ipc.sendSync('check-plugin-exists', github)

        if ( ! exists) {
            robot.fire("notification:info", "Starting to downloading plugin...")
            clone(repo, path, (err, result) => {
                if (err) {
                    robot.fire('notification:error', "Something went wrong with the installation...")
                } else {
                    robot.fire('notification:info', "Downloaded plugin...")

                    var plugin = {
                        github,
                        installedAt: +new Date(),
                        name: github.split('/')[1].replace('Plugin-', ''),
                        path,
                        branchOrTag
                    }

                    robot.fire('notification:info', `Installing ${plugin.name} plugin...`)

                    let savedPlugin = ipc.sendSync('save-plugin', plugin)

                    robot.fire('pluginmanager:register-plugin', savedPlugin)
                }
            })
        } else {
            Event.fire('notification:info', "Plugin already installed!")
        }
    })

}