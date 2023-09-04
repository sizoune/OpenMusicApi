/* eslint-disable no-underscore-dangle */
const autoBind = require('auto-bind');

class AlbumHandler {
  constructor(albumService, songService, validator) {
    this._albumService = albumService;
    this._songService = songService;
    this._validator = validator;

    // this.postAlbumHandler = this.postAlbumHandler.bind(this);
    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;

    // console.log(name, year);

    const albumId = await this._albumService.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      message: 'Album, berhasil ditambahkan',
      data: {
        albumId,
      },
    });

    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { albumID } = request.params;
    const album = await this._albumService.getAlbumById(albumID);
    const songs = await this._songService.getSongByAlbumId(albumID);

    return {
      status: 'success',
      data: {
        album: {
          ...album,
          songs,
        },
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const { albumID } = request.params;

    await this._albumService.editAlbumById(albumID, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteNoteByIdHandler(request) {
    const { albumID } = request.params;
    await this._albumService.deleteAlbumById(albumID);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }
}

module.exports = AlbumHandler;
