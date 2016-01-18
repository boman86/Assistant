module.exports = h => {
    return {
        type: 'empty',
        cb: contents => {
            return h('div', contents)
        }
    }
}