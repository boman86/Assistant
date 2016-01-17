module.exports = robot => {
    const h = robot.h

    robot.listen(/^calc (.*)?$/, "Calculate something", res => {
        let el = h('div', {}, [
            h('h3', `The result of ${res.matches[0].sub[0]}`),
            h('pre', `= ${eval(res.matches[0].sub[0])}`)
        ])
        robot.spawnCard('blank', el)
    })
}