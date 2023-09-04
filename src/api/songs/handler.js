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
      title, year, genre, performer, duration, albumId,
    } = request.payload;

    // console.log(name, year);

    const songId = await this._service.addSong({
      title, year, genre, performer, duration, albumId,
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

  async getSongsHandler(request) {
    // console.log(request.query.title);
    let songs;
    if (request.query.title && request.query.performer) {
      songs = await this._service.getSongByTitleAndPerformer(
        request.query.title,
        request.query.performer,
      );
    } else if (request.query.title) {
      songs = await this._service.getSongByTitle(
        request.query.title,
      );
    } else if (request.query.performer) {
      songs = await this._service.getSongByPerformer(
        request.query.performer,
      );
    } else {
      songs = await this._service.getSongs();
    }

    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongsByTitleHandler(request) {
    const songs = await this._service.getSongByTitle(request.query.title);
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongsByPerformerHandler(request) {
    const songs = await this._service.getSongByPerformer(request.query.performer);
    return {
      status: 'success',
      data: {
        songs,
      },
    };
  }

  async getSongByIdHandler(request) {
    const { songID } = request.params;
    const song = await this._service.getSongById(songID);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request) {
    this._validator.validateSongPayload(request.payload);
    const { songID } = request.params;

    await this._service.editSongById(songID, request.payload);

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    };
  }

  async deleteSongByIdHandler(request) {
    const { songID } = request.params;
    await this._service.deleteSongById(songID);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = SongHandler;
