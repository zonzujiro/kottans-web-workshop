'use strict'

const https = require('https')
const path = require('path')
const keeper = require('./keeper.js')
const formidable = require('formidable')
const fs = require('fs')

function onError(error) {
    throw new Error(error)
}

function get(path) {
    return new Promise((resolve, reject) => {
        let options = {
            host: 'randomuser.me',
            path: path,
            method: 'GET'
        }

        let request = https.request(options, (res) => {
            let response = '';
            
            res.on('data', chunk => response += chunk)
            res.on('end', () => resolve(response))
        })

        request.on('error', onError)
        request.end()
    })
}

function savePhoto(req) {
    return new Promise((resolve, reject) => {
        let form = new formidable.IncomingForm()
        
        let name = ''
        
        form.uploadDir = path.join(__dirname, './uploads')

        form.on('file', (field, file) => {
            name = file.name
            fs.rename(file.path, path.join(form.uploadDir, name))
        });

        form.on('error', err => reject(err))

        form.on('end', () => {
            let response = {
                id: Date.now() * Math.random(),
                url: `/server/uploads/${name}`
            }

            resolve(response)
        });

        form.parse(req)
    })
}

function getPhotos() {
    return Promise.resolve(keeper.get('photos'))
}

function getMe() {
    return new Promise(function(resolve, reject) {
        if (keeper.get('me')) {
            resolve(keeper.get('me'))
        
        } else {
            get('/api/').then(res => {
                keeper.add('me', JSON.parse(res))
                resolve(keeper.get('me'))
            })
        }
    })
}

function getFriends() {
    return new Promise(function(resolve, reject) {
        if (keeper.get('friends')) {
            resolve(keeper.get('friends'))
        
        } else {
            get('/api/?results=15').then(res => {
                keeper.add('friends', JSON.parse(res))
                resolve(keeper.get('friends'))
            })
        }
    })
}

module.exports = {
    getMe: getMe,
    getPhotos: getPhotos,
    getFriends: getFriends,
    savePhoto: savePhoto
}