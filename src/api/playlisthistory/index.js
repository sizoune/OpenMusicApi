const PlaylistHistoryHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'activities',
  version: '1.0.0',
  register: async (server, {
    service, playlistService,
  }) => {
    const playlistHistoryHandler = new PlaylistHistoryHandler(service, playlistService);
    server.route(routes(playlistHistoryHandler));
  },
};
