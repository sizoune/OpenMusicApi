const routes = (handler) => [
  {
    method: 'POST',
    path: '/export/playlist/{playlistId}',
    handler: handler.postExportPlaylistHandler,
    options: {
      auth: 'openmusicapp_jwt',
    },
  },
];

module.exports = routes;
