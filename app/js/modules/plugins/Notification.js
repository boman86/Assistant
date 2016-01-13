module.exports = robot => {
    const h = robot.h

    robot.on('notification:notification_list', list => {
        var element = h('div', {}, [
            h('h3', `History List (${list.total})`),
            h('ol', {}, list.items.map(i => {
                return h('li', i.command)
            }).toArray())
        ])

        robot.spawnCard(element)
    })

    robot.listen(/^notification history$/, "A list of all previous notifications.", res => {
        robot.fire('notification:fetch_notification_list')
    })
}