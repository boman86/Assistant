import clone from "git-clone"
import { app } from "remote"
import fs from "fs"
import { ipcRenderer as ipc } from "electron"
import { List, Map } from "Immutable"
//
// class PluginControlComponent {
//
//     constructor(robot, state) {
//         this.robot = robot
//         this.h = robot.h
//         this.manager = new PluginControlManager(this.robot)
//
//         this.base = "https://api.github.com"
//         this.org = "PersonalAssistant"
//
//         this.loading = []
//         this.repos = this.List([])
//         this.fetching = true
//
//         this.fetch()
//     }
//
//     fetch() {
//         this.robot.fetchJson(`${this.base}/orgs/${this.org}/repos`).then(data => {
//             this.repos = this.List(data)
//             this.repos.forEach(plugin => {
//                 this.loading[plugin.full_name] = false
//             })
//
//             this.fetching = false
//
//             this.robot.update(this.id, this.render())
//         })
//     }
//
//     setLoading(loading, plugin) {
//         this.loading[plugin] = loading
//         this.robot.update(this.id, this.render())
//     }
//
//     install(plugin) {
//         this.setLoading(true, plugin)
//         this.manager.install(plugin, () => this.setLoading(false, plugin))
//     }
//
//     uninstall(plugin) {
//         this.setLoading(true, plugin)
//         this.manager.uninstall(plugin, () => this.setLoading(false, plugin))
//     }
//
//     renderButton(p) {
//         let installed = ipc.sendSync('check-plugin-exists', p.full_name)
//
//         return installed
//             ? this.h('button.button.button--red.right', {
//                 disabled: this.loading[p.full_name],
//                 onclick: (e) => this.uninstall(p.full_name)
//             }, [
//                 this.h(this.loading[p.full_name] ? 'span.fa.fa-spinner.fa-pulse' : 'span.fa.fa-trash-o'),
//                 this.h('span', {}, this.loading[p.full_name] ? 'Removing' : 'Remove')
//             ])
//             : this.h('button.button--theme.right', {
//                 disabled: this.loading[p.full_name],
//                 onclick: (e) => this.install(p.full_name)
//             }, [
//                 this.h(this.loading[p.full_name] ? 'span.fa.fa-spinner.fa-pulse' : 'span.fa.fa-download'),
//                 this.h('span', {}, this.loading[p.full_name] ? 'Installing' : 'Install')
//             ])
//     }
//
//     renderItem(p) {
//         return this.h('span', {}, [
//             this.renderButton(p),
//             p.name
//         ])
//     }
//
//     render() {
//         return {
//             title: `${this.org} Available Plugins`,
//             items: this.fetching
//                     ? [this.h('div', {}, [
//                         this.h('span.fa.fa-spinner.fa-pulse.breathing'),
//                         this.h('span', {}, "Loading online plugins...")
//                     ])]
//                     : this.repos.map(p => this.renderItem(p)).toArray()
//         }
//     }
// }
//
// class PluginControlManager {
//     constructor(robot) {
//         this.robot = robot
//     }
//
//     async(fn, done) {
//         setTimeout(() => {
//             fn()
//             if (done) done()
//         }, 0)
//     }
//
//     install(github, done) {
//         let directory = app.getPath("userData") + "/plugins"
//         let filename = +new Date()
//         let path = `${directory}/${filename}`
//
//         let repo = `https://github.com/${github}.git`
//         let exists = ipc.sendSync('check-plugin-exists', github)
//
//         if (exists) {
//             Event.fire('notification:info', "Plugin already installed!")
//             done()
//             return
//         }
//
//         this.robot.fire("notification:info", "Starting to download plugin...")
//         this.async(() => {
//             clone(repo, path, (err, result) => {
//                 if (err) {
//                     this.robot.fire('notification:error', "Something went wrong with the installation...")
//                     done()
//                 } else {
//                     this.robot.fire('notification:info', "Downloaded plugin...")
//
//                     var packageInfo = JSON.parse(fs.readFileSync(`${path}/package.json`, 'utf8'))
//
//                     var plugin = {
//                         github,
//                         installedAt: +new Date(),
//                         name: packageInfo.name || github.split('/')[1].replace('Plugin-', ''),
//                         path,
//                         version: packageInfo.version,
//                         html_url: repo,
//                         enabled: true
//                     }
//
//                     this.robot.fire('notification:info', `Installing ${plugin.name} plugin...`)
//
//                     ipc.send("save-plugin", plugin)
//
//                     done()
//                 }
//             })
//         })
//     }
//
//     uninstall(github, done) {
//         if (ipc.sendSync('check-plugin-exists', github)) {
//             var plugin = ipc.sendSync('remove-plugin', github)
//
//             if (plugin) {
//                 this.robot.fire('plugins:remove_plugin', plugin)
//                 this.robot.fire("notification:success", `Removed ${github}`)
//             } else {
//                 this.robot.fire("notification:error", `Could not remove ${github}`)
//             }
//             done()
//         } else {
//             this.robot.fire("notification:warning", `We can not remove a plugin which is not installed`)
//             done()
//         }
//     }
// }

module.exports = robot => {

    // const Immutable = robot.Immutable
    // const h = robot.h
    // const manager = new PluginControlManager(robot)
    //
    // ipc.on('saved-plugin', (event, data) => {
    //     if ( ! data.err) {
    //         robot.fire('plugins:register_plugin', data.plugin)
    //     }
    // })
    //
    // // robot.listen(/^test$/, "List of installed plugins", res => {
    // //     robot.fire('plugins:fetch_plugin_list', list => {
    // //         robot.spawnCard('list', {
    // //             title: 'Installed Plugins',
    // //             items: list.map(p => p.name).toArray()
    // //         })
    // //     })
    // // })
    //
    // robot.listen(/^plugins? list online$/, "List of online plugins", res => {
    //     robot.spawn(PluginControlComponent, "list")
    // })
    //
    // robot.listen(/^remove plugin (.*)$/, "Remove a plugin", res => {
    //     let github = res.matches[1]
    //
    //     manager.uninstall(github)
    // })
    //
    // robot.listen(/^install plugin (.*)$/, "Install a plugin from github", res => {
    //     let github = res.matches[1]
    //
    //     manager.install(github)
    // })

}
