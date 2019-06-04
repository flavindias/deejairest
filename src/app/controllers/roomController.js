const uuidv4 = require('uuid/v4');
const  Room = require('../models/Room');
const  RoomUser = require('../models/RoomUser');

module.exports = {
    /*
        Método para listar todas as salas do usuário
        Parametro: nenhum
        Método http: GET
     */
    index: (req, res) => {

        // console.log(req.done)
        Room.findAll({
            where: {
                owner_id: req.user.dataValues.id
            },
            include: {
                all: true
            }
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
        Room.create({
            owner_id: req.user.dataValues.id,
            code: code
        }).then(
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
    view: (req, res) => {
        Room.findOne({
            where: {
                code: req.params.code
            },
            include: {
                all: true
            }
        }).then( result => {
            if (result){
                console.log(result)
                res.send(result)
            }
        })

    }

}