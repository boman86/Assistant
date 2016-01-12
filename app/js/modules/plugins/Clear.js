module.exports = robot => {

    robot.listen(/^clear ?(screen)?$/, "Clear the screen", res => {
        robot.clearScreen()
    })

    robot.on('clear', () => {
        robot.clearScreen()
    })
    robot.on('clear:screen', () => {
        robot.clearScreen()
    })
}