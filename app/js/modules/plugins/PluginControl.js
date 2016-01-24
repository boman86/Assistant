import clone from "git-clone"
import { app } from "remote"
import fs from "fs"
import { ipcRenderer as ipc } from "electron"

class PluginControlManager {
    constructor(robot) {
        this.robot = robot
    }

    async(fn, done) {
        setTimeout(() => {
            fn()
            if (done) done()
        }, 0)
    }

    install(github) {
        let directory = app.getPath("userData") + "/plugins"
        let filename = +new Date()
        let path = `${directory}/${filename}`

        let repo = `https://github.com/${github}.git`
        let exists = ipc.sendSync('check-plugin-exists', github)

        if ( ! exists) {
            this.robot.fire("notification:info", "Starting to download plugin...")
            this.async(() => {
                clone(repo, path, (err, result) => {
                    if (err) {
                        this.robot.fire('notification:error', "Something went wrong with the installation...")
                    } else {
                        this.robot.fire('notification:info', "Downloaded plugin...")

                        var packageInfo = JSON.parse(fs.readFileSync(`${path}/package.json`, 'utf8'))

                        var plugin = {
                            github,
                            installedAt: +new Date(),
                            name: github.split('/')[1].replace('Plugin-', ''),
                            path,
                            version: packageInfo.version
                        }

                        this.robot.fire('notification:info', `Installing ${plugin.name} plugin...`)

                        ipc.send('save-plugin', plugin)

                        ipc.on('saved-plugin', (event, err) => {
                            if ( ! err) {
                                this.robot.fire('plugins:register-plugin', plugin)
                            }
                        })
                    }
                })
            })
        } else {
            Event.fire('notification:info', "Plugin already installed!")
        }
    }

    uninstall(github) {
        if (ipc.sendSync('check-plugin-exists', github)) {
            var plugin = ipc.sendSync('remove-plugin', github)

            if (plugin) {
                this.robot.fire('plugins:remove_plugin', plugin)
                this.robot.fire("notification:success", `Removed ${github}`)
            } else {
                this.robot.fire("notification:error", `Could not remove ${github}`)
            }
        } else {
            this.robot.fire("notification:warning", `We can not remove a plugin which is not installed`)
        }
    }
}

module.exports = robot => {

    const Immutable = robot.Immutable
    const h = robot.h
    const manager = new PluginControlManager(robot)

    robot.listen(/^plugins? list online$/, "List of online plugins", res => {
        let base = "https://api.github.com"
        let org = "PersonalAssistant"

        robot.fetchJson(`${base}/orgs/${org}/repos`)
            .then(data => {
                robot.spawnCard('list', {
                    title: `${org} Available Plugins`,
                    items: Immutable.List(data).map(p => {
                        let installed = ipc.sendSync('check-plugin-exists', p.full_name)
                        return h('span', {}, [
                            installed
                            ? h('button.button.button--red.right', {
                                onclick: (e) => {
                                    manager.uninstall(p.full_name)
                                }
                            }, [h('span.fa.fa-trash-o'), "Remove"])
                            : h('button.button--theme.right', {
                                disabled: installed,
                                onclick: (e) => {
                                    manager.install(p.full_name)
                                }
                            }, [h('span.fa.fa-download'), 'Install']),
                            p.name
                        ])
                    }).toArray()
                })
            })
    })

    robot.listen(/^remove plugin (.*)$/, "Remove a plugin", res => {
        let github = res.matches[1]

        manager.uninstall(github)
    })

    robot.listen(/^install plugin (.*)$/, "Install a plugin from github", res => {
        let github = res.matches[1]

        manager.install(github)
    })

}