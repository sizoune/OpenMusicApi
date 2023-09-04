const autoBind = require('auto-bind');

class PlaylistSongsHandler {
  constructor(service, playlistsService, songsService, validator) {
    this._service = service;
    this._validator = validator;
    this._playlistsService = playlistsService;
    this._songsService = songsService;

    autoBind(this);
  }

  async postPlaylistSongHandler(request, h) {
    this._validator.validatePlaylistSongPayload(request.payload);
    const { playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._songsService.getSongById(songId);
    const playlistSongId = await this._service.addSongToPlaylist({ songId, owner: credentialId });

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
    const { playlistId } = request.params;
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    const dataPlaylist = await this._playlistsService.getPlaylistSongs(playlistId, credentialId);
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
    const { playlistId } = request.params;
    const { songId } = request.payload;
    const { id: credentialId } = request.auth.credentials;
    await this._playlistsService.verifyPlaylistOwner(playlistId, credentialId);
    await this._service.deletePlaylistSongById(playlistId, songId);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus dari playlist!',
    };
  }
}

module.exports = PlaylistSongsHandler;
