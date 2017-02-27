'use strict'

let storage = {
    photos: [{
        id: 3,
        url: 'https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/J8EX2W3DDD.jpg'
    }, {
        id: 4,
        url: 'https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/Y6ZU9PLWWI.jpg'
    }, {
        id: 6,
        url: 'https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/3F9YK7F0KC.jpg'
    }, {
        id: 8,
        user: 33,
        url: 'https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/MEJR9GUN3Q.jpg'
    }, {
        id: 3,
        url: 'https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/J8EX2W3DDD.jpg'
    }, {
        id: 4,
        url: 'https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/Y6ZU9PLWWI.jpg'
    }, {
        id: 6,
        url: 'https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/3F9YK7F0KC.jpg'
    }, {
        id: 8,
        user: 33,
        url: 'https://d2lm6fxwu08ot6.cloudfront.net/img-thumbs/960w/MEJR9GUN3Q.jpg'
    }]
}

function isEmpty(object) {
    return !Object.keys(object).length
}

function add(key, value) {
    if (!key || !value) {
        throw new TypeError('Unable to resolve "add": key or value not provided')
    }

    storage[key] = value
}

function get(key) {
    return storage[key]
}

module.exports = {
    add: add,
    get: get
}