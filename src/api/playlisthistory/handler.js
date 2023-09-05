const autoBind = require('auto-bind');

class PlaylistHistoryHandler {
  constructor(service, playlistService) {
    this._service = service;
    this._playlistService = playlistService;

    autoBind(this);
  }

  async getPlaylistHistoryHandler(request) {
    const { id: credentialId } = request.auth.credentials;
    const { id: playlistId } = request.params;

    await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
    const history = await this._service.getHistory(playlistId);

    return {
      status: 'success',
      data: {
        playlistId,
        activities: history.map((activity) => ({
          username: activity.username,
          title: activity.title,
          action: activity.action,
          time: activity.time,
        })),
      },
    };
  }
}

module.exports = PlaylistHistoryHandler;
