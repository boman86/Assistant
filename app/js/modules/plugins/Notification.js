module.exports = robot => {
    const h = robot.h

    robot.on('notification:notification_list', list => {
        var element = h('div', {}, [
            h('h3', `Notification History (${list.total})`),
            h('div', {}, list.items.toArray())
        ])

        robot.spawnCard(element)
    })

    robot.listen(/^notifications? ?(history)?$/, "A list of all previous notifications.", res => {
        robot.fire('notification:fetch_notification_list')
    })
}