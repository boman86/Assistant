module.exports = robot => {
    const h = robot.h

    robot.listen(/^clear ?(screen)?$/, "Clear the screen", res => {
        robot.fire('clear')

        robot.spawnCard(h('h3', 'I cleared your screen, you\'re welcome!'))
    })
}