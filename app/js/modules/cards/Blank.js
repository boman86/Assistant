module.exports = h => {
    return {
        type: 'blank',
        cb: contents => {
            return h('.card', contents)
        }
    }
}