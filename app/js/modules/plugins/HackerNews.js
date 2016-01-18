module.exports = robot => {

    const h = robot.h

    robot.listen(/^hn$/, "Hackernews stories", res => {
        var children = []

        fetch("https://hacker-news.firebaseio.com/v0/topstories.json")
            .then(res => res.json())
            .then(data => {
                data.forEach(id => {
                    fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
                        .then(res => res.json())
                        .then(d => {
                            children.push(
                                h('a', { href: d.url, target: "_blank" }, [String(d.title)])
                            )
                        })
                })
            })

        setTimeout(() => {
            robot.spawnCard('list', {
                title: "HackerNews",
                items: children
            })
        }, 500)
    })

}