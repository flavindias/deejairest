const Room = require('../models/Room');
const RoomUser = require('../models/RoomUser');
const Playlist = require('../models/Playlist');
const PlaylistTrack = require('../models/PlaylistTrack');
const Vote = require('../models/Vote');
const UserTrack = require('../models/UserTracks');

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
          console.log(resp);
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
      console.log(allowUser)
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
                    track_id: track.dataValues.id,
                    user_id: req.user.dataValues.id,
                    playlist_id: parseInt(req.params.id)
                  },
                  defaults: {
                    track_id: track.dataValues.id,
                    user_id: req.user.dataValues.id,
                    playlist_id: parseInt(req.params.id),
                    active: true,
                    createdAt: new Date(),
                    updatedAt: new Date()
                  }
                });
            })
          }


        })
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
  vote: async (req, res) => {
    try {
      // Checar se o usuário pertece a sala

      // Checar se a playlist pertence a sala

      // Checar se a track está na playlist

      // Votar

    }
    catch (e) {
      console.log(e)
    }

  }
}