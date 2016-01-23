/**
 * List Card
 *
 * data:
 * {
 *   title: String, // Optional
 *   items: []      // Required to be an array
 * }
 */
module.exports = h => {
    return {
        type: 'list',
        cb: data => {
            let children = []
            if (data.title) {
                children.push(h('h3', data.title))
            }

            let items = []

            for (var i = 0; i < data.items.length; i++) {
                var item = data.items[i]

                items.push(h('li.card--list__item', {}, [h('span', item)]))
            }

            children.push(h('ul.card--list', {}, items))

            return h('ul.card', children)
        }
    }
}