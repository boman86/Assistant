module.exports = robot => {
    const h = robot.h

    robot.listen(/help/, "Show a list of all available commands", res => {
        robot.fire('plugins:fetch_plugin_list', list => {

            var children = []

            // Header Row
            children.push(h('tr.header-row', {}, [
                h('td', 'Plugin Name'),
                h('td', 'Action RegEx'),
                h('td', 'Description')
            ]))

            // Contents
            list.forEach(i => {
                var showed = false

                i.commands.forEach(c => {
                    children.push(h('tr', {}, [
                        h('td', {}, [
                            showed ? null : h('h3', String(i.name))
                        ]),
                        h('td', String(c.name)),
                        h('td', String(c.description)),
                    ]))

                    showed = true
                })
            })

            // Render
            var element = h('table.table.table-hover', {}, [
                h('thead', {}, [
                    h('tr', {}, [
                        h('th', {}, [
                            h('h3', 'Help')
                        ])
                    ])
                ]),
                h('tbody', {}, children),
                h('tfoot', {}, [
                    h('tr', {}, [
                        h('td', { colSpan: 3 }, `${list.count()} plugins installed.`)
                    ])
                ])
            ])

            robot.spawnCard('empty', element)
        })
    })
}
