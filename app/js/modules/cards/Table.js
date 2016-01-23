/**
 * Table Card
 *
 * data:
 * {
 *     title: String,   // Optional
 *     header: [],      // Array
 *     body: [[]],      // Array of arrays
 *     footer: [[]]     // Array of arrays
 * }
 */
module.exports = (h, Immutable) => {
    return {
        type: 'table',
        cb: data => {
            let children = []

            if (data.title) {
                let head = h('thead', {}, [
                    h('tr', {}, [h('th', {}, [ h('h3', {}, data.title)])])
                ])

                children.push(head)
            }

            let body = []

            if (data.header) {
                body.push(
                    h('tr.header-row', {}, Immutable.List(data.header).map(i => h('td', {}, i)).toArray())
                )
            }

            if (data.body) {
                data.body.forEach(row => {
                    body.push(
                        h('tr', {}, Immutable.List(row).map(i => h('td', {}, i)).toArray())
                    )
                })
            }

            children.push(h('tbody', body))

            if (data.footer) {
                children.push(
                    h('tfoot', {}, [h('tr', {}, Immutable.List(data.footer).map(i => h('td', {}, i)).toArray())])
                )
            }

            return h('table.table.table-hover', {}, children)
        }
    }
}