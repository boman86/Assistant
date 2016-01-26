/**
 * Blank Card
 *
 * contents is rendered directly to a div with class `card`
 */
module.exports = h => {
    return {
        type: 'blank',
        cb: contents => {
            return h('.card.item', contents)
        }
    }
}
