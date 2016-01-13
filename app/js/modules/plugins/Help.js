module.exports = robot => {
    const h = robot.h

    robot.on('plugins:plugin_list', list => {
        var element = h('div', {}, [
            h('h3', 'Help'),
            h('dl', list.map(i => {
                return h('di', h('dt', i.name), h('dd', i.commands.map(c => {
                    return h('li', [
                        h('span', c.name),
                        h('span', ' - '),
                        h('span', c.description)
                    ])
                }).toArray()))
            }).toArray())
        ])

        robot.spawnCard(element)
    }, true)

    robot.listen(/help/, "Show a list of all available commands", res => {
        robot.fire('plugins:fetch_plugin_list')
    })
}