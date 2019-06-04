const axios = require('axios');
const Track = require('../models/Track');
const UserTrack = require('../models/UserTracks');

module.exports = {
    topSongs: async (req, res) => {
        try {
            const response = await axios.get(
                "https://api.spotify.com/v1/me/top/tracks?limit=50&",
                {headers: {
                        "Authorization" : `Bearer ${req.user.dataValues.token}`
                    }
                }
            )
                .then((resp) => {
                        var response = resp.data;
                        response.items.map(music => {
                            Track.findOrCreate({
                                where: {
                                    id: music.id
                                },
                                defaults: {
                                    id:  music.id,
                                    name: music.name,
                                    duration: music.duration_ms,
                                    popularity: music.popularity,
                                    createdAt: new Date(),
                                    updatedAt: new Date()
                                }
                            }).then(
                                ([track, created]) => {
                                    console.log(track.dataValues.id)
                                    UserTrack.findOrCreate({
                                        where: {
                                            user_id: req.user.dataValues.id,
                                            track_id: track.dataValues.id
                                        },
                                        defaults: {
                                            user_id: req.user.dataValues.id,
                                            track_id: track.dataValues.id,
                                            createdAt: new Date(),
                                            updatedAt: new Date()
                                        }
                                    })

                                }
                            )

                        })
                        res.send(response)

                    },
                    (error) => {

                        var status = error.response.status
                    }
                );
            console.log(response);
            // res.send(response)
        } catch (error) {
            console.error(error);
        }
    }
}