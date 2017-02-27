'use strict'

const https = require('https')
const path = require('path');
const data = require('./data.js')
const formidable = require('formidable')
const fs = require('fs')

let me = {}
let friends = {}
let photos = normalize(data.photos)

function onError(error) {
    throw new Error(error)
}

function isEmpty(object) {
    return !Object.keys(object).length
}

function normalize(array) {
    let result = {}

    array.forEach(item => result[item.id] = item)

    return result
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
    return Promise.resolve(data.photos)
}

function getMe() {
    return new Promise(function(resolve, reject) {
        if (!isEmpty(me)) {
            resolve(me)
        
        } else {
            get('/api/').then(res => {
                me = JSON.parse(res)
                resolve(me)
            })
        }
    })
}

function getFriends() {
    return new Promise(function(resolve, reject) {
        if (!isEmpty(friends)) {
            resolve(friends)
        
        } else {
            get('/api/?results=15').then(res => {
                friends = JSON.parse(res)
                resolve(friends)
            })
        }
    })
}

module.exports = {
    getMe,
    getPhotos,
    getFriends,
    savePhoto
}