/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class SongHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    // this.postAlbumHandler = this.postAlbumHandler.bind(this);
    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const {
      title, year, genre, performer, duration, albumID,
    } = request.payload;

    // console.log(name, year);

    const songId = await this._service.addSong({
      title, year, genre, performer, duration, albumID,
    });

    const response = h.response({
      status: 'success',
      message: 'Lagu, berhasil ditambahkan',
      data: {
        songId,
      },
    });

    response.code(201);
    return response;
  }

  async getSongsHandler() {
    const songs = await this._service.getSongs();
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request, h) {
    const { songID } = request.params;
    const song = await this._service.getSongById(songID);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    const { songID } = request.params;

    await this._service.editSongById(songID, request.payload);

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    };
  }

  async deleteSongByIdHandler(request, h) {
    const { songID } = request.params;
    await this._service.deleteSongById(songID);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = SongHandler;
