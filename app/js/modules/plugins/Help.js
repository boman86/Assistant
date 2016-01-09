module.exports = external => {
    return robot => {
        const h = robot.h

        robot.listen(/help/, "Show a list of all available commands", res => {
            let pluginList = external.pluginManager.list()

            var element = h('div', {}, [
                h('h3', 'Help'),
                h('dl', pluginList.map(i => {
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
        })

    }
}