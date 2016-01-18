module.exports = robot => {
    const h = robot.h

    robot.listen(/^history$/, "A list of commands you have used previously.", res => {
        robot.fire('history:fetch_history_list', list => {
            robot.spawnCard('list', {
                title: `History List (${list.total})`,
                items: list.items.map((i, index) => {
                    return `${index + 1}. ${i.command}`
                }).toArray()
            })
        })
    })

    robot.listen(/^clear history$/, "Clear the history list.", res => {
        robot.fire('history:clear')
    })
}