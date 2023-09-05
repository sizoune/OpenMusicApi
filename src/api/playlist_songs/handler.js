const autoBind = require('auto-bind');

class PlaylistSongsHandler {
  constructor(service, validator, playlistsService, songsService, playlistHistoryService) {
    this._service = service;
    this._validator = validator;
    this._playlistsService = playlistsService;
    this._songsService = songsService;
    this._playlistHistoryService = playlistHistoryService;

    autoBind(this);
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._songsService.getSongById(songId);
    const playlistSongId = await this._service.addSongToPlaylist({ playlistId, songId });
    await this._playlistHistoryService.addHistory(playlistId, songId, credentialId, 'add');

    const response = h.response({
      status: 'success',
      message: 'Lagu berhasil ditambahkan ke Playlist',
      data: {
        playlistSongId,
      },
    });
    response.code(201);
    return response;
  }

  async getPlaylistSongHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    const dataPlaylist = await this._playlistsService.getPlaylistById(playlistId);
    const songs = await this._songsService.getSongsByPlaylistId(playlistId);

    return {
      status: 'success',
      data: {
        playlist: {
          ...dataPlaylist,
          songs,
        },
      },
    };
  }

  async deletePlaylistSongHandler(request) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { id: playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistAccess(playlistId, credentialId);
    await this._service.deletePlaylistSongById(playlistId, songId);
    await this._playlistHistoryService.addHistory(playlistId, songId, credentialId, 'delete');

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist!',
    };
  }
}

module.exports = PlaylistSongsHandler;
