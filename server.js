'use strict';

const express = require('express')
const app = express()
const sockets = require('./server/sockets.js')()
const proxy = require('./server/proxy.js')

app.use(express.static(__dirname))
app.listen(3000)

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.post('/me', (req, res) => {
    proxy.savePhoto(req).then(data => {
        res.send(JSON.stringify(data))
    })
})

app.get('/me', (req, res) => {
    proxy.getMe().then(data => {
        res.send(JSON.stringify(data))
    })
})

app.get('/friends', (req, res) => {
    proxy.getFriends().then(data => {
        res.send(JSON.stringify(data))
    })
})

app.get('/photos', (req, res) => {
    proxy.getPhotos().then(data => {
        res.send(JSON.stringify(data))
    })
})
