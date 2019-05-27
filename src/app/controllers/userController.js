
const axios = require('axios');

var UserController = {
    topTracks: function (req, res) {
        console.log(req)
        console.log(res)
        axios.get('http://google.com.br').then(res => {
            console.log(res)
        })
    }
}