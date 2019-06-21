const uuidv4 = require('uuid/v4');
const Room = require('../models/Room');
const RoomUser = require('../models/RoomUser');
const Tracks = require('../models/Track');
const User = require('../models/User');
const Artist = require('../models/Artist');
const Genre = require('../models/Genre');

module.exports = {
    /*
        Método para listar todas as salas do usuário
        Parametro: nenhum
        Método http: GET
     */
    //TODO return rooms that I was a member
    index: (req, res) => {

        // console.log(req.done)
        Room.findAll({
            where: {
                owner_id: req.user.dataValues.id
            },
            include: [{
                model: User,
                as: 'owner'
            },{
                model: Tracks,
                as: 'tracks'
            },{
                model: User,
                as: 'members'
            }]
        }).then(
            result => {
                if (result){
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
            where:{
                code: req.params.code,
                public: true,
                active: true
            }
        }).then( result => {
            if (result){
                if (result.dataValues.owner_id !== req.user.dataValues.id){
                    RoomUser.findOrCreate({
                        where:{
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
                    }).then( ([reslt, created]) => {
                        if (created){
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
                else{
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
            fields['location'] = {
                type: 'Point', coordinates: [req.body.latitude,req.body.longitude]
            }
        }
        Room.create(fields).then(
            result => {
                if (result){
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
            include: [{
                model: User,
                as: 'owner'
            },{
                model: Tracks,
                as: 'tracks',
                include:[{
                    model: Artist,
                    as: 'artists',
                    include: [{
                        model: Genre,
                        as: 'genres'
                    }]
                }]
            },{
                model: User,
                as: 'members'
            }]
        }).then( result => {
            if (result){
                res.send(result)
            }
        })

    },
    //    TODO remove a user from room
    remove: (req, res) => {
        req.params.user_id ? void(0) : res.status(404).json({message: "user_id is required."});
        Room.findOne({
            where: {
                code: req.params.code
            },
            include: {
                all: true
            }
        }).then( result => {
            if (result){
                if (req.user.dataValues.id == result.owner_id){
                    RoomUser.destroy({
                        where: {
                            room_id: result.id,
                            user_id: parseInt(req.params.user_id)
                        }
                    }).then( RUresult => {
                        if (RUresult){
                            res.status(204).json({
                                message: "User has been removed."
                            })
                        }
                        else{
                            res.status(400).json({
                                message: "User cannot be removed."
                            })
                        }
                    })

                }
                else{
                    res.status(403).json({
                        message: "You are not the owner."
                    })
                }
            }
            else{
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
        }).then( result => {
            if (result){
                RoomUser.destroy({
                    where: {
                        room_id: result.id,
                        user_id: req.user.dataValues.id
                    }
                }).then( RUresult => {
                    if (RUresult){
                        res.status(204).json({
                            message: "User has been quited."
                        })
                    }
                    else{
                        res.status(400).json({
                            message: "User cannot be quited."
                        })
                    }
                })

            }
            else{
                res.status(404).json({
                    message: "Room not found."
                })
            }
        })
    }
}