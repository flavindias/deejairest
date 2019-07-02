const Room = require('../models/Room');
const RoomUser = require('../models/RoomUser');
const Playlist = require('../models/Playlist');
const PlaylistTrack = require('../models/PlaylistTrack');
const Vote = require('../models/Vote');
const UserTrack = require('../models/UserTracks');
const Track = require('../models/Track');
const Artist = require('../models/Artist');
const Genre = require('../models/Genre');
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
              usersTracks.push(track.dataValues.track_id);
            });
            if (!usersTracks.includes(req.body.track_id)) {
              await PlaylistTrack.findOne({
                where: {
                  track_id: req.body.track_id,
                  playlist_id: parseInt(req.params.id)
                }
              }).then(async resPT => {
                if (resPT) {
                  Vote.findOrCreate({
                    where: {
                      playlist_track_id: resPT.dataValues.id,
                      user_id: req.user.dataValues.id
                    },
                    defaults: {
                      playlist_track_id: resPT.dataValues.id,
                      user_id: req.user.dataValues.id,
                      rating: req.body.rating,
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
                        vote.rating = req.body.rating
                        vote.save()
                        res.status(200).json({
                          message: 'Vote has been updated'
                        });
                      }
                    }
                  })
                }
                else {
                  res.status(403).json({
                    message: "You can't vote in this playlist."
                  })
                }
              })
            }
            else {
              res.status(403).json({
                message: "You can't vote in your music."
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
  },
  /*
    Método para retornar todos ss
  */
  songs: async (req, res) => {
    try {
      // Checar se a playlist pertence a sala
      Playlist.findOne({
        where: {
          id: parseInt(req.params.id)
        },
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
      }).then(
        async resp => {
          if (resp) {
            console.log(resp);
            // Checar se o usuário pertece a sala
            Room.findOne({
              where: {
                id: resp.dataValues.room_id,
                owner_id: req.user.dataValues.id
              }
            }).then(respRoom => {
              if (respRoom.lenght !== 0) {
                res.status(200).json(resp.dataValues.tracks);
              }
              else {
                RoomUser.findOne({
                  where: {
                    user_id: req.user.dataValues.id,
                    room_id: resp.dataValues.room_id
                  }
                }).then(respRU => {
                  if (respRU) {
                    res.status(200).json(resp.dataValues.tracks);
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
    }
    catch (e) {
      res.status(500)
    }
  },
  /*
    Método para criar uma nova playlist
  */
  add: async (req, res) => {
    try {
      let allowUser = false;
      // Checar se a playlist pertence a sala
      await Room.findOne({
        where: {
          id: req.body.room_id,
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
              room_id: req.body.room_id,
            }
          }).then(respRU => {
            if (respRU) {
              allowUser = true
            }
          });
        }
      });

      if (allowUser) {
        // Checar se a música pertence a playlist
        Playlist.create({
          room_id: req.body.room_id,
          approach: "USER"
        }).then(respPl => {
          if (respPl) {
            res.status(201).json({
              message: "Playlist has been created."
            })
          }
          else {
            res.status(502).json({
              message: "Something wrong."
            })
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
  // Refatorar
  availableTracks: async (req, res) => {
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
              usersTracks.push(track.dataValues.track_id);
            });

            // await PlaylistTrack.findOne({
            //   where: {
            //     track_id: {
            //       [ Op.notIn ]: usersTracks
            //     },
            //     playlist_id: parseInt(req.params.id)
            //   },
            //   include: [ {
            //     model: Track,
            //     as: 'track'
            //   } ]
            // })
            Playlist.findAll({
              where: {
                id: parseInt(req.params.id)
              },
              include: [ {
                model: Track,
                as: 'tracks',
                where: {
                  id: {
                    [ Op.notIn ]: usersTracks
                  }
                }
              } ]
            }).then(async resPT => {
              if (resPT) {
                let tracks = resPT.map(item => {
                  return item.tracks;
                });
                res.status(200).json(tracks);
              }
              else {
                res.status(403).json({
                  message: "You can't vote in this playlist."
                })
              }
            })
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
      res.status(500).json(e);
    }

  }
}