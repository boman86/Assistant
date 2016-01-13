module.exports = robot => {
    const h = robot.h

    robot.on('history:history_list', list => {
        var element = h('div', {}, [
            h('h3', `History List (${list.total})`),
            h('ol', {}, list.items.map(i => {
                return h('li', i.command)
            }).toArray())
        ])

        robot.spawnCard(element)
    })

    robot.listen(/^history$/, "A list of commands you have used previously.", res => {
        robot.fire('history:fetch_history_list') // Request the history list
    })

    robot.listen(/^clear history$/, "Clear the history list.", res => {
        robot.fire('history:clear')
    })
}