/**
 * Empty Card
 *
 * contents is rendered directly to an empty div
 */
module.exports = h => {
    return {
        type: 'empty',
        cb: contents => {
            return h('div', contents)
        }
    }
}