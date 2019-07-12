const Room = require('../models/Room');
const RoomUser = require('../models/RoomUser');
const Playlist = require('../models/Playlist');
const PlaylistTrack = require('../models/PlaylistTrack');
const Vote = require('../models/Vote');
const UserTrack = require('../models/UserTrack');
const Track = require('../models/Track');
const Artist = require('../models/Artist');
const Genre = require('../models/Genre');
const User = require('../models/User');
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
          id: parseInt(req.params.id),
          approach: 'USER'
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
                    user_id: req.user.dataValues.id,
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
      let roomid = 0;
      let owner_id = 0
      // Checar se a playlist pertence a sala
      let resp = await Playlist.findOne({
        where: {
          id: parseInt(req.params.id)
        }
      });
      if (resp) {
        roomid = resp.dataValues.room_id
        let resu = await Room.findOne({
          where: {
            id: resp.dataValues.room_id,
            owner_id: req.user.dataValues.id
          }
        })
        if (resu) {
          allowUser = true
          owner_id = req.user.dataValues.id
        }
        else {
          let respRU = await RoomUser.findAll({
            where: {
              user_id: req.user.dataValues.id,
              room_id: resp.dataValues.room_id
            }
          })
          if (respRU) {
            console.log(respRU)
            owner_id = respRU.dataValues.owner_id
            allowUser = true
          }
        }
      }
      else {
        res.status(404).json({
          message: 'Playlist not found'
        })
      }

      if (allowUser) {
        let usersTracks = []
        let users = []
        users.push(owner_id)

        console.log(`users: ${users}`)
        await RoomUser.findAll({
          where: {
            room_id: roomid
          }
        }).then(resRU => {

          resRU.map(usr => {
            users.push(usr.dataValues.user_id)
          })
        });
        // users = Array.from(new Set(users)).sort()
        var index = users.indexOf(req.user.dataValues.id);
        if (index > -1) {
          users.splice(index, 1);
        }
        User.findAll({
          where: {
            id: {
              [ Op.in ]: users
            }
          },
          include: [ {
            model: Track,
            as: 'tracks',
            where: {
              id: req.body.track_id
            },
            include: [ {
              all: true
            } ]
          } ]
        }).then(
          resu => {
            console.log(resu)
            PlaylistTrack.findOrCreate(
              {
                where: {
                  playlist_id: req.params.id,
                  track_id: req.body.track_id
                },
                defaults: {
                  playlist_id: req.params.id,
                  user_id: req.user.dataValues.id,
                  track_id: req.body.track_id,
                  active: true,
                  createdAt: new Date(),
                  updatedAt: new Date()
                }
              }
            ).then((resPT, create) => {

              if (resPT[ 0 ]) {

                Vote.findOrCreate({
                  where: {
                    playlist_track_id: resPT[ 0 ].dataValues.id,
                    user_id: req.user.dataValues.id
                  },
                  defaults: {
                    playlist_track_id: resPT[ 0 ].dataValues.id,
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

            })
          }
        )



























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
  /*
    Método para retornar as faixas disponíveis para aquele usuário naquela playlist para voto
  */
  availableTracks: async (req, res) => {
    try {
      let allowUser = false;
      let roomid = 0;
      let owner_id = 0
      // Checar se a playlist pertence a sala
      let resp = await Playlist.findOne({
        where: {
          id: parseInt(req.params.id)
        }
      });
      if (resp) {
        roomid = resp.dataValues.room_id
        let resu = await Room.findOne({
          where: {
            id: resp.dataValues.room_id,
            owner_id: req.user.dataValues.id
          }
        })
        if (resu) {
          allowUser = true
          owner_id = req.user.dataValues.id
        }
        else {
          let respRU = await RoomUser.findAll({
            where: {
              user_id: req.user.dataValues.id,
              room_id: resp.dataValues.room_id
            }
          })
          if (respRU) {
            console.log(respRU)
            owner_id = respRU.dataValues.owner_id
            allowUser = true
          }
        }
      }
      else {
        res.status(404).json({
          message: 'Playlist not found'
        })
      }
      if (allowUser) {
        // Checar se a música pertence a playlist
        let usersTracks = []
        let users = []
        users.push(owner_id)

        console.log(`users: ${users}`)
        await RoomUser.findAll({
          where: {
            room_id: roomid
          }
        }).then(resRU => {
          console.log(resRU)
          resRU.map(usr => {
            console.log(usr.dataValues.user_id)
            users.push(usr.dataValues.user_id)
          })
        });
        // users = Array.from(new Set(users)).sort()
        var index = users.indexOf(req.user.dataValues.id);
        if (index > -1) {
          users.splice(index, 1);
        }
        User.findAll({
          where: {
            id: {
              [ Op.in ]: users
            }
          },
          include: [ {
            model: Track,
            as: 'tracks',
            required: false,
            include: [ {
              all: true
            } ]
          } ]
        }).then(
          async reees => {
            const result = []
            const rest = reees.map((item) => { return item.dataValues.tracks.length != 0 && result.push(item.dataValues.tracks) })

            const resps = { ...result }
            console.log(resps)
            res.status(200).json(resps)
            // reees.map(async track => {
            //   usersTracks.push(track.dataValues.track_id);
            // });
          }
        )

        // await UserTrack.findAll({
        //   where: {
        //     user_id: {
        //       [ Op.in ]: users
        //     },
        //   }
        // }).then(async resUsr => {
        //   if (resUsr) {
        //     if (resUsr) {
        //       // resUsr.map(async track => {
        //       //   usersTracks.push(track.dataValues.track_id);
        //       // });
        //       const result = []
        //       await resUsr.map(item => {
        //         result.push(...item.tracks);
        //       });
        //       const rst = []
        //       result[ 0 ].map(itm => {
        //         rst.push(...itm)
        //       })
        //       res.status(200).json(rst);
        //     }



        //     await Playlist.findAll({
        //       where: {
        //         id: parseInt(req.params.id)
        //       },
        //       include: [ {
        //         model: Track,
        //         as: 'tracks',
        //         include: [ {
        //           all: true
        //         } ],
        //         // where: {
        //         //   id: {
        //         //     [ Op.in ]: usersTracks
        //         //   }
        //         // }
        //       } ]
        //     }).then(async resPT => {
        //       if (resPT) {
        //         console.log(resPT)
        //         const result = []
        //         // await resPT.map(item => {
        //         //   result.push(...item.tracks);
        //         // });
        //         res.status(200).json(result);
        //       }
        //       else {
        //         res.status(403).json({
        //           message: "You can't vote in this playlist."
        //         })
        //       }
        //     })
        //   }
        // });
      }
      else {
        res.status(403).json({
          message: "You can't do that."
        })
      }

    }
    catch (e) {
      console.log(e)
      res.status(500).json(e);
    }

  },
  /*
    Método para retornar as faixas que já foram votadas
  */
  finalTracks: async (req, res) => {
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

            PlaylistTrack.findAll({
              where: {
                playlist_id: parseInt(req.params.id),
              },
              include: [ {
                model: Vote,
                as: 'votes',
                attributes: {
                  exclude: [ 'user_id', 'playlist_track_id' ]
                },
                where: {
                  rating: {
                    [ Op.ne ]: null
                  }
                },

              }, {
                model: Track,
                as: 'track'
              } ]
            }).then(resPLT => {
              if (resPLT) {
                const resultPLT = [];
                resPLT.map(item => {
                  const { track, votes } = item;
                  track.dataValues.votes = votes;
                  resultPLT.push(track);
                });
                // ordenando pela média de votos
                const sort = resultPLT.sort((a, b) => {
                  return ((b.dataValues.votes.reduce((sum, vote) => {
                    return sum + vote.rating;
                  }, 0) / b.dataValues.votes.length) -
                    (a.dataValues.votes.reduce((sum, vote) => {
                      return sum + vote.rating;
                    }, 0) / b.dataValues.votes.length))
                })
                res.send(sort);
              }
              else {
                res.status(404).json({
                  message: "Playlist not found."
                })
              }
            });
          }
        });
      }

    }
    catch (e) {
      console.warn(e);
    }
  },
  ia: (req, res) => {

  }
}