module.exports = robot => {
    const h = robot.h

    robot.listen(/^shortcuts$/, "Display a list of all shortcuts", res => {
        let card = h('div', {}, [
            h('h3', 'Shortcut List'),
            h('table.table', {}, [
                h('tr', {}, [
                    h('td', 'Item 1'),
                    h('td', 'Item 2'),
                ]),
                h('tr', {}, [
                    h('td', 'Item 1'),
                    h('td', 'Item 2'),
                ]),
                h('tr', {}, [
                    h('td', 'Item 1'),
                    h('td', 'Item 2'),
                ])
            ])
        ])

        robot.spawnCard(card)
    })
}