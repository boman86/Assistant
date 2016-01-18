module.exports = robot => {
    navigator.getBattery().then(battery => {
        var chargingChanged = () => robot.fire("battery:charging:changed", { charging: battery.charging })
        var levelChanged = () => robot.fire("battery:level:changed", { level: battery.level, percentage: Math.round(battery.level * 100) })
        var chargingTimeChanged = () => robot.fire("battery:chargingtime:changed", { seconds: battery.chargingTime })
        var dischargingTimeChanged = () => robot.fire("battery:dischargingtime:changed", { seconds: battery.dischargingTime })

        battery.addEventListener('chargingchange', chargingChanged)
        battery.addEventListener('levelchange', levelChanged)
        battery.addEventListener('chargingtimechange', chargingTimeChanged)
        battery.addEventListener('dischargingtimechange', dischargingTimeChanged)

        robot.on('battery:request', cb => cb(battery))
    })

    robot.on('battery:level:changed', data => {
        if (data.percentage < 20) {
            robot.fire("notification:warning", `You might want to watch out, your battery is at ${data.percentage}%`)
        }

        if (data.percentage < 10) {
            robot.fire("notification:error", `Plug in your charger, battery is at ${data.percentage}%`)
        }
    })

    robot.on('battery:charging:changed', battery => {
        robot.fire("notification:info", `Battery is ${battery.charging ? "charging" : "not charging"}`)
    })

    robot.listen(/^battery charging$/, "Is the battery charging?", res => {
        robot.fire("battery:request", battery => {
            robot.fire("notification:info", `Battery is ${battery.charging ? "charging" : "not charging"}`)
        })
    })

    robot.listen(/^battery level$/, "Show the battery level", res => {
        robot.fire("battery:request", battery => {
            var msg = `Battery level at ${Math.round(battery.level * 100)}%`

            robot.fire("notification:success", msg)
        })
    })
}
