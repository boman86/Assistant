module.exports = robot => {
    const h = robot.h

    robot.listen(/^clear ?(screen)?$/, "Clear the screen", res => {
        robot.clearScreen()
    })

}