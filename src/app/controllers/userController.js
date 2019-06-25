const axios = require('axios');
const Track = require('../models/Track');
const UserTrack = require('../models/UserTracks');
const Artist = require('../models/Artist');
const TrackArtist = require('../models/TrackArtist');
const ArtistGenre = require('../models/ArtistGenre');
const Genre = require('../models/Genre');

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
                                async ([track, created]) => {
                                    try{
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
                                        await music.artists.map(async artist => {

                                            await Artist.findOrCreate({
                                                where: {
                                                    id: artist.id
                                                },
                                                defaults: {
                                                    id: artist.id,
                                                    name: artist.name,
                                                    href: artist.href,
                                                    uri: artist.uri,
                                                    createdAt: new Date(),
                                                    updatedAt: new Date()
                                                }
                                            }).then(async result => {

                                                TrackArtist.create({
                                                    artist_id: artist.id,
                                                    track_id: track.dataValues.id
                                                })
                                                var resp = await axios.get(
                                                    `https://api.spotify.com/v1/artists/${artist.id}`,
                                                    {headers: {
                                                            "Authorization" : `Bearer ${req.user.dataValues.token}`
                                                        }
                                                    }).then(resp => {
                                                    if (resp){

                                                        var response = resp.data
                                                        response.genres.map(
                                                            async genre => {
                                                                var genreName = await Genre.findOne({
                                                                    where: {
                                                                        name: genre
                                                                    }
                                                                })
                                                                if (genreName){
                                                                    ArtistGenre.findOrCreate({
                                                                        where:
                                                                            {
                                                                                artist_id: artist.id,
                                                                                genre_id: genreName.id
                                                                            },
                                                                            defaults:
                                                                                {
                                                                                    artist_id: artist.id,
                                                                                    genre_id: genreName.id,
                                                                                    active: true,
                                                                                    createdAt: new Date(),
                                                                                    updatedAt: new Date()
                                                                                }
                                                                        }
                                                                    )
                                                                }
                                                            }
                                                        )
                                                    }

                                                })

                                            })


                                        })
                                    }
                                    catch (e) {
                                        console.log(e)
                                    }


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