module.exports = robot => {
    robot.listen(/^clear ?(screen)?$/, "Clear the screen", res => {
        robot.fire('clear')
    })
}