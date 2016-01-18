module.exports = h => {
    return {
        type: 'table',
        cb: data => {
            return h('.card', data)
        }
    }
}