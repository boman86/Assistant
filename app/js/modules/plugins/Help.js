module.exports = robot => {
    const h = robot.h

    robot.listen(/help/, "Show a list of all available commands", res => {
        robot.fire('plugins:fetch_plugin_list', list => {
            var element = h('div', {}, [
                h('h3', 'Help'),
                h('dl', {}, list.map(i => {
                    return h('div', {}, [
                        h('strong', {}, String(i.name)),
                        h('dd', i.commands.map(c => {
                            return h('li', [
                                h('span', String(c.name)),
                                h('span', ' - '),
                                h('span', String(c.description))
                            ])
                        }).toArray())
                    ])
                }).toArray())
            ])

            robot.spawnCard('blank', element)
        })
    })
}