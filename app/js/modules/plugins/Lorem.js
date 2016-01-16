import lorem from "lorem-ipsum"
import { clipboard } from "electron"

module.exports = robot => {
    const h = robot.h

    robot.listen(/^lorem ?(\d*)?$/, "Lorem ipsum generator", res => {

        let config = {
            count: res.matches[0].sub[0] || 1,
            units: 'paragraphs',
            paragraphLowerBound: 1,
            paragraphUpperBound: 5
        }

        let output = lorem(config)

        let el = h('div.clearfix', {}, [
            h('button.button.right', {
                onclick: () => {
                    clipboard.writeText(output)
                    robot.fire('notification:success', 'Copied lorem ipsum text to clipboard!')
                }
            }, [
                h('span.fa.fa-copy'),
                h('span', 'Copy to clipboard')
            ]),
            h('h3', `Lorem Ipsum (${config.count} paragraph${config.count == 1 ? '' : 's'})`),
            h('pre', output)
        ])

        robot.spawnCard(el)
    })
}