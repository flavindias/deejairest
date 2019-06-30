const Room = require('../models/Room');
const RoomUser = require('../models/RoomUser');
const Playlist = require('../models/Playlist');
const PlaylistTrack = require('../models/PlaylistTrack');
const Vote = require('../models/Vote');
const UserTrack = require('../models/UserTracks');
const Op = require('sequelize').Op;

module.exports = {
  /*
    Método para sincronizar (importar) as músicas do usuário com a playlist
  */
  sync: async (req, res) => {
    try {
      let allowUser = false;
      // Checar se a playlist pertence a sala
      await Playlist.findOne({
        where: {
          id: parseInt(req.params.id)
        }
      }).then(
        async resp => {
          if (resp) {
            // Checar se o usuário pertece a sala
            await Room.findOne({
              where: {
                id: resp.dataValues.room_id,
                owner_id: req.user.dataValues.id
              }
            }).then(res => {
              if (res.lenght !== 0) {
                allowUser = true
              }
              else {
                RoomUser.findOne({
                  where: {
                    user_id: req.user.dataValues.id,
                    room_id: resp.dataValues.room_id
                  }
                }).then(respRU => {
                  if (respRU) {
                    allowUser = true
                  }
                });
              }
            });
          }
          else {
            res.status(404).json({
              message: 'Playlist not found'
            })
          }
        }
      )
      // Importar as músicas
      if (allowUser) {
        await UserTrack.findAll({
          where: {
            user_id: req.user.dataValues.id
          }
        }).then(resUsr => {
          if (resUsr) {
            resUsr.map(async track => {
              await PlaylistTrack.findOrCreate(
                {
                  where: {
                    track_id: track.dataValues.track_id,
                    playlist_id: parseInt(req.params.id)
                  },
                  defaults: {
                    track_id: track.dataValues.track_id,
                    playlist_id: parseInt(req.params.id),
                    active: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                  }
                });
            });
            res.status(201);
          }
        });
      }
      else {
        res.status(403).json({
          message: "You can't do that."
        })
      }

    }
    catch (e) {
      res.status(500)
    }
  },
  /*
    Método para votar nas músicas que estão importadas na playlist
  */
  vote: async (req, res) => {
    try {
      let allowUser = false;
      // Checar se a playlist pertence a sala
      await Playlist.findOne({
        where: {
          id: parseInt(req.params.id)
        }
      }).then(
        async resp => {
          if (resp) {
            // Checar se o usuário pertece a sala
            await Room.findOne({
              where: {
                id: resp.dataValues.room_id,
                owner_id: req.user.dataValues.id
              }
            }).then(res => {
              if (res.lenght !== 0) {
                allowUser = true
              }
              else {
                RoomUser.findOne({
                  where: {
                    user_id: req.user.dataValues.id,
                    room_id: resp.dataValues.room_id
                  }
                }).then(respRU => {
                  if (respRU) {
                    allowUser = true
                  }
                });
              }
            });
          }
          else {
            res.status(404).json({
              message: 'Playlist not found'
            })
          }
        }
      )

      if (allowUser) {
        // Checar se a música pertence a playlist
        let usersTracks = []
        await UserTrack.findAll({
          where: {
            user_id: req.user.dataValues.id
          }
        }).then(async resUsr => {
          if (resUsr) {
            resUsr.map(async track => {
              usersTracks.append(track.dataValues.track_id)

            });
            if (!usersTracks.includes(req.body.track_id)) {
              await Vote.findOrCreate({
                where: {
                  track_id: req.body.track_id,
                  user_id: req.user.dataValues.id
                },
                defaults: {
                  track_id: req.body.track_id,
                  user_id: req.user.dataValues.id,
                  active: true,
                  createdAt: new Date(),
                  updatedAt: new Date()
                }
              }).then(([ vote, created ]) => {
                if (vote) {
                  if (created) {
                    res.status(201).json({
                      message: 'Vote has been registred.'
                    });
                  }
                  else {
                    res.status(200).json({
                      message: 'Vote has been updated'
                    });
                  }
                }
              })
            }
            res.status(201);
          }
        });

      }
      else {
        res.status(403).json({
          message: "You can't do that."
        })
      }

    }
    catch (e) {
      res.status(500)
    }

  }
}