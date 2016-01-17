import username from "username"

module.exports = robot => {
    let config = {
        username: username.sync()
    }

    robot.spawnCard('image', {
        title: `Images for ${config.username}`,
        images: [
            {title: "image 1", src: "http://d.pr/i/19S6T+"},
            {title: "image 2", src: "http://d.pr/i/19S6T+"}
        ]
    })
}