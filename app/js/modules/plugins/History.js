module.exports = external => {
    return robot => {
        const h = robot.h

        robot.listen(/^history$/, "A list of commands you have used previously.", res => {
            let historyList = external.historyManager.history()

            var element = h('div', {}, [
                h('h3', `History List (${historyList.total})`),
                h('ol', {}, historyList.items.map(i => {
                    return h('li', i.command)
                }).toArray())
            ])

            robot.spawnCard(element)
        })

        robot.listen(/^clear history$/, "Clear the history list.", res => {
            external.historyManager.clear()

            robot.spawnCard(h('p', 'Cleared the history!'))
        })

    }
}