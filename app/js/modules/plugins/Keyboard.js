module.exports = robot => {
    const h = robot.h

    robot.listen(/^shortcuts$/, "Display a list of all shortcut bindings", res => {
        robot.fire('keyboard:fetch_keyboard_list', list => {
            let card = h('div', {}, [
                h('h3', 'Shortcut List'),
                h('table.table', {}, list.items.map(binding => {
                    return h('tr', {}, [
                        h('td', binding.get('binding')),
                        h('td', binding.get('event')),
                    ])
                }).toArray())
            ])

            robot.spawnCard(card)
        })
    })
}