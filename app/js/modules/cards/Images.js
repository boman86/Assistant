/**
 * Images Card
 *
 * data:
 * {
 *   title: String, // Optional
 *   images: [{
 *       src: String, // Required
 *       title: String, // Optional
 *   }] // Required to be an array
 * }
 */
module.exports = (h, Immutable) => {
    return {
        type: 'images',
        cb: data => {
            let children = []

            if (data.title) {
                children.push(h('h3', data.title))
            }

            children.push(
                h('.images', {}, Immutable.List(data.images).map(img => h('img', {
                    alt: img.title,
                    title: img.title,
                    src: img.src
                })).toArray()
            ))

            return h('.card.card--images.item', children)
        }
    }
}
