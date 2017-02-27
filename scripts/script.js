window.onload = function() {
    init()

    function init() {
        const getMe = () => get('/me').then(drawProfile)
        const getGallery = () => get('/photos').then(drawGallery)
        const getFriends = () => get('/friends').then(drawFriends)

        getMe().then(getGallery).then(getFriends).then(activateChat)
    }

    function get(url) {
        return new Promise(function(resolve, reject) {
            let xhr = new XMLHttpRequest()

            xhr.onreadystatechange = function() {
                if (xhr.status == 200 && xhr.readyState == 4) {
                    resolve(JSON.parse(xhr.responseText))
                }
            }

            xhr.open('GET', url, true)

            xhr.send(null)
        })
    }

    function post(url, data) {
        return new Promise(function(resolve, reject) {
            let xhr = new XMLHttpRequest()

            let formData = new FormData()

            formData.append('file', data)

            xhr.onreadystatechange = function() {
                if (xhr.status == 200 && xhr.readyState == 4) {
                    resolve(JSON.parse(xhr.responseText))
                }
            }

            xhr.open('POST', url, true)
            xhr.send(formData)
        })
    }

    function drawFriends(data) {
        const { results: friendsList } = data

        let friends = document.createElement('div')
        let parent = document.getElementById('profile')

        friends.id = 'friends'

        friendsList.forEach(drawUser)
        parent.replaceChild(friends, document.getElementById('friends'))

        function drawUser(user) {
            let friend = document.createElement('div'),
                photo = document.createElement('img')
            
            friend.classList.add('friend')
            photo.src = user.picture.medium;
            friend.appendChild(photo)
            friends.appendChild(friend)
        }
    }

    function drawProfile(data) {
        const user = data.results[0]
        
        let parent = document.getElementById('profile')

        let bio = document.createElement('div'),
            name = document.createElement('name'),
            phone = document.createElement('phone'),
            email = document.createElement('email')

        name.classList.add('name')
        phone.classList.add('phone')
        email.classList.add('email')
        bio.id = 'bio'

        name.innerHTML = `<p>${user.name.first} ${user.name.last}</p>`
        phone.textContent = user.phone
        email.textContent = user.email

        bio.appendChild(name)
        bio.appendChild(phone)
        bio.appendChild(email)

        updateAvatar(user.picture.large)
        parent.replaceChild(bio, document.getElementById('bio'))
    }

    const uploadInput = document.getElementById('photo-input')

    uploadInput.addEventListener('change', (e) => {
        let file = e.target.files[0]
        let types = ['image/jpeg', 'image/gif', 'image/png']
        
        if (!file || !types.includes(file.type)) {
            e.target.value = null;
            return
        }

        post('/me', file).then(res => updateAvatar(res.url))
    })

    function updateAvatar(newSrc) {
        document.getElementById('avatar').src = newSrc
    }

    function drawGallery(photos) {
        let gallery = document.createElement('div')
        let parent = document.getElementById('ribbon')

        gallery.id = 'gallery'

        photos.forEach(drawPhoto)
        parent.replaceChild(gallery, document.getElementById('gallery'))

        function drawPhoto(photo) {
            let wrapper = document.createElement('div'),
                img = document.createElement('img')
                
            wrapper.classList.add('photo')
            img.src = photo.url
            wrapper.appendChild(img)
            gallery.appendChild(wrapper)
        }
    }

    function activateChat() {
        const button = document.querySelector('button')
        const input = document.getElementById('reply-input')
        const replies = document.getElementById('replies')

        const socket = new WebSocket('ws://localhost:8081')
        socket.onmessage = (e) => addReply(e.data)

        button.addEventListener('click', (e) => {
            if (e.which == 1) addReply()
        })

        input.addEventListener('keydown', (e) => {
            if (e.which == 13) addReply()
        })

        function addReply() {    
            let text = input.value.trim()

            if (!text.length) return

            let reply = wrapReply(text)
            replies.appendChild(reply)
            socket.send(text)
            input.value = null
        }

        function wrapReply(text) {
            let container = document.createElement('div')

            container.classList.add('reply')
            container.innerHTML = `<p>${text}</p>`

            return container
        }
    }
}
