module.exports = h => {
    return {
        type: 'image',
        cb: data => {
            let children = []
            if (data.title) {
                children.push(h('h3', data.title))
            }

            let images = []

            for (var i = 0; i < data.images.length; i++) {
                var img = data.images[i];

                images.push(h('img', {
                    alt: img.title,
                    src: img.src,
                }))
            };

            children.push(h('div', {}, images))

            return h('.card', children)
        }
    }
}