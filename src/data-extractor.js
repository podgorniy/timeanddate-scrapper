const Crawler = require('crawler')

const crawler = new Crawler({
    maxConnections: 5,
    // This will be called for each crawled page
    callback: function (error, res, done) {
        throw new Error(`You must provide custom callback`)
        done()
    }
})

let itemsQueued = 0

const _completeCallbacks = []

function _callCompleteIfNeeded() {
    if (!itemsQueued) {
        _completeCallbacks.forEach((callback) => {
            callback()
        })
    }
}

exports.onComplete = function (handler) {
    _completeCallbacks.push(handler)
}

exports.enqueue = function ({uri: uri, callback} = params) {
    itemsQueued += 1
    crawler.queue({
        uri,
        callback: (error, res, done) => {
            callback(error, res, function () {
                itemsQueued -= 1
                _callCompleteIfNeeded()
                done()
            })
        }
    })
}
