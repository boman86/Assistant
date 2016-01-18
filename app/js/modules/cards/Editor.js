// TODO: Editor Integration somehow

module.exports = h => {
    return {
        type: 'editor',
        cb: contents => {
            return h('.card', h('pre', {}, [contents]))
        }
    }
}