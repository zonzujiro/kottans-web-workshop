'use strict'

function launchSocket() {
    const WebSocketServer = require('ws')

    const webSocketServer = new WebSocketServer.Server({
        port: 8081
    })

    let clients = {}

    webSocketServer.on('connection', (ws) => {
        const id = parseInt(Date.now() * Math.random())

        clients[id] = ws

        ws.on('message', (message) => {
            for (let key in clients) {
                if (key != id) {
                    clients[key].send(message)
                }
            }
        })

        ws.on('close', () => delete clients[id])
    })
}

module.exports = launchSocket
