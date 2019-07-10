const axios = require('axios');
const uuidv4 = require('uuid/v4');
const Room = require('../models/Room');
const RoomUser = require('../models/RoomUser');
const Playlist = require('../models/Playlist');
const Feature = require('../models/Feature');
const Track = require('../models/Track');
const User = require('../models/User');
const Artist = require('../models/Artist');
const Genre = require('../models/Genre');
const UserTrack = require('../models/UserTrack');
const PlaylistTrack = require('../models/PlaylistTrack');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

module.exports = {
    /*
        Método para listar todas as salas do usuário
        Parametro: nenhum
        Método http: GET
     */
    index: async (req, res) => {

        let memberRooms = []
        await RoomUser.findAll({
            where: {
                user_id: req.user.dataValues.id,

            }
        }).then(respRU => {
            if (respRU) {
                respRU.map(room => {
                    memberRooms.push(room.dataValues.id);
                });
            }
        });

        // console.log(req.done)
        await Room.findAll({
            where: {
                [ Op.or ]: {
                    owner_id: req.user.dataValues.id,
                    id: {
                        [ Op.in ]: memberRooms
                    }
                }
            },
            include: [ {
                model: User,
                as: 'owner'
            }, {
                model: Playlist,
                as: 'playlists',
                include: [ {
                    model: Track,
                    as: 'tracks'
                } ]
            }, {
                model: User,
                as: 'members'
            } ]
        }).then(
            result => {
                if (result) {
                    res.status(200).json(result)
                }
                return res.status(204)
            }
        )
    },
    /*
        Método para entrar em uma sala
        Parametro: id da sala
        Método http: POST
     */
    join: (req, res) => {
        Room.findOne({
            where: {
                code: req.params.code,
                public: true,
                active: true
            }
        }).then(result => {
            if (result) {
                if (result.dataValues.owner_id !== req.user.dataValues.id) {
                    RoomUser.findOrCreate({
                        where: {
                            room_id: result.dataValues.id,
                            user_id: req.user.dataValues.id,
                            active: true
                        },
                        defaults: {
                            room_id: result.dataValues.id,
                            user_id: req.user.dataValues.id,
                            createdAt: new Date(),
                            updatedAt: new Date()
                        }
                    }).then(([ reslt, created ]) => {
                        if (created) {
                            req.io
                                .of('/rooms')
                                .on('connection', (socket) => {
                                    chat.emit('joined', {
                                        everyone: 'in'
                                        , '/rooms': req.params.code,
                                        message: `${req.user.display_name} joined at room #${result.dataValues.id}`
                                    });
                                });
                            res.status(201).json({
                                message: "You successfully joined to the room."
                            })
                        }
                        else {
                            res.send({
                                message: "You already joined at this room."
                            })
                        }

                    })
                }
                else {
                    res.send({
                        message: "You can't join to your own room."
                    })
                }
            }
        })

    },
    /*
        Método para criar em uma sala
        Parametro: nenhum
        Método http: POST
     */
    create: (req, res) => {
        let code = uuidv4()
        var fields = {
            owner_id: req.user.dataValues.id,
            code: code

        }
        if (req.body.latitude) {
            fields[ 'location' ] = {
                type: 'Point', coordinates: [ req.body.latitude, req.body.longitude ]
            }
        }
        if (req.body.description) {
            fields[ 'description' ] = req.body.description
        }
        Room.create(fields).then(
            result => {
                if (result) {
                    res.status(201).json({
                        message: 'Room has been created.',
                        code: code
                    })
                }
            }
        )
    },
    //TODO check if user are a member or owner
    view: (req, res) => {
        Room.findOne({
            where: {
                code: req.params.code
            },
            include: [ {
                model: User,
                as: 'owner'
            },
            {
                model: Playlist,
                as: 'playlists',
                include: [ {
                    model: Track,
                    as: 'tracks',
                    include: [ {
                        model: Artist,
                        as: 'artists',
                        include: [ {
                            model: Genre,
                            as: 'genres'
                        } ]
                    } ]
                } ]
            },
            {
                model: User,
                as: 'members'
            } ]
        }).then(result => {
            if (result) {
                res.send(result)
            }
            else {
                res.status(404).json({
                    message: "Room not found."
                })
            }
        })

    },
    simpleView: (req, res) => {
        Room.findOne({
            where: {
                code: req.params.code
            },
            attributes: {
                exclude: [ 'id' ]
            },
            include: [ {
                model: User,
                as: 'owner',
                attributes: {
                    exclude: [
                        'hash_password',
                        'spotify_id',
                        'product',
                        'type',
                        'reset_password_token',
                        'reset_password_token_created_at',
                        'reset_password_token_expires_in',
                        'birthdate',
                        'country',
                        'email',
                        'href',
                        'id',
                        'active'
                    ]
                }
            },
            {
                model: User,
                as: 'members'
            } ]
        }).then(result => {
            if (result) {
                result.dataValues.membersCount = result.dataValues.members.lenght
                delete (result.dataValues.members)
                delete (result.dataValues.owner_id)
                res.send(result)
            }
        })

    },
    //    TODO remove a user from room
    remove: (req, res) => {
        req.params.user_id ? void (0) : res.status(404).json({ message: "user_id is required." });
        Room.findOne({
            where: {
                code: req.params.code
            },
            include: {
                all: true
            }
        }).then(result => {
            if (result) {
                if (req.user.dataValues.id == result.owner_id) {
                    RoomUser.destroy({
                        where: {
                            room_id: result.id,
                            user_id: parseInt(req.params.user_id)
                        }
                    }).then(RUresult => {
                        if (RUresult) {
                            res.status(204).json({
                                message: "User has been removed."
                            })
                        }
                        else {
                            res.status(400).json({
                                message: "User cannot be removed."
                            })
                        }
                    })

                }
                else {
                    res.status(403).json({
                        message: "You are not the owner."
                    })
                }
            }
            else {
                res.status(404).json({
                    message: "Room not found."
                })
            }
        })
    },
    //    TODO quit from room
    quit: (req, res) => {
        Room.findOne({
            where: {
                code: req.params.code
            },
            include: {
                all: true
            }
        }).then(result => {
            if (result) {
                RoomUser.destroy({
                    where: {
                        room_id: result.id,
                        user_id: req.user.dataValues.id
                    }
                }).then(RUresult => {
                    if (RUresult) {
                        res.status(204).json({
                            message: "User has been quited."
                        })
                    }
                    else {
                        res.status(400).json({
                            message: "User cannot be quited."
                        })
                    }
                })

            }
            else {
                res.status(404).json({
                    message: "Room not found."
                })
            }
        })
    },
    generatePlaylist: async (req, res) => {
        Room.findOne({
            where: {
                code: req.params.code
            },
            include: [ {
                model: User,
                as: 'owner',
            }, {
                model: User,
                as: 'members'
            } ]
        }).then(async resRo => {
            let result = []
            let retorno = []
            if (resRo) {

                const { id } = resRo.dataValues.owner
                result.push(id)
                resRo.dataValues.members.map(member => {
                    result.push(member.dataValues.id)
                })
                UserTrack.findAll({
                    where: {
                        user_id: {
                            [ Op.in ]: result
                        }
                    }
                }).then(async resUT => {
                    Promise.all(resUT.map(async ut => {
                        await Feature.findOne({
                            where: {
                                track_id: ut.dataValues.track_id
                            }
                        }).then(resFt => {
                            if (resFt) {
                                ut.dataValues.feature = resFt
                                retorno.push(ut)
                            }
                        })
                    })).then(resultp => {
                        res.send(retorno)
                        console.log(result)
                    });




                })
            }
            else {
                res.status(404)
            }

        })
    },
    listFromIA: async (req, res) => {
        try {
            Room.findOne({
                where: {
                    code: req.body.code
                },
                include: [ {
                    model: Playlist,
                    as: 'playlists',
                    include: [ {
                        model: Track,
                        as: 'tracks',
                        include: [ {
                            all: true
                        } ]
                    } ]
                } ]
            }).then(async resRoom => {


                // if (resRoom.dataValues.playlists.filter(playlist => playlist.dataValues.approach == "IA").length !== 0) {

                // console.log(resRoom.dataValues.playlists.filter(playlist => playlist.dataValues.approach == "IA"))
                // res.status(200).json(resRoom.dataValues.playlists.filter(playlist => playlist.dataValues.approach == "IA")[ 0 ].tracks)
                // }
                // else {

                await axios.post(
                    "http://localhost:5000/generateGrade",
                    {
                        code: req.body.code
                    }
                ).then(async response => {
                    if (response) {
                        await Playlist.create({
                            approach: 'IA',
                            room_id: resRoom.dataValues.id,
                            user_id: req.user.dataValues.id

                        }).then(async resPl => {
                            await response.data.map(
                                track => {
                                    PlaylistTrack.findOrCreate({
                                        where: {
                                            playlist_id: resPl.dataValues.id,
                                            track_id: track
                                        },
                                        defaults: {
                                            playlist_id: resPl.dataValues.id,
                                            track_id: track,
                                            user_id: req.user.dataValues.id,
                                            active: true,
                                            createdAt: new Date(),
                                            updatedAt: new Date()
                                        },
                                        include: [ {
                                            all: true
                                        } ]
                                    })
                                }
                            )
                            await Track.findAll({
                                where: {
                                    id: {
                                        [ Op.in ]: response.data
                                    }
                                },
                                include: [ {
                                    all: true

                                } ]
                            }).then(resTrack => {
                                if (resTrack) {
                                    res.status(200).json(resTrack);
                                }
                                else {
                                    res.status(404)
                                }
                            })
                        })
                    }
                    else {
                        res.status(404)
                    }
                })


                // }

            })

        }
        catch (e) {
            res.status(500).json(e)
        }

    }
}