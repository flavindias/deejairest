const Room = require('../models/Room');
const Playlist = require('../models/Playlist');
const PlaylistTrack = require('../models/PlaylistTrack');
const Vote = require('../models/Vote');

module.exports = {
  /*
    Método para sincronizar (importar) as músicas do usuário com a playlist
  */
  sync: async (req, res) => {
    // Checar se o usuário pertece a sala

    // Checar se a playlist pertence a sala

    // Importar as músicas

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