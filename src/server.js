require('dotenv').config();
// hapi
const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');
const path = require('path');

// error
const ClientError = require('./exceptions/ClientError');

// albums
const albums = require('./api/albums');
const AlbumService = require('./services/app_services/AlbumServices');
const AlbumsValidator = require('./validator/albums');

// songs
const songs = require('./api/songs');
const SongService = require('./services/app_services/SongServices');
const SongsValidator = require('./validator/songs');

// users
const users = require('./api/users');
const UsersService = require('./services/app_services/UsersServices');
const UsersValidator = require('./validator/users');

// authentications
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/app_services/AuthenticationsService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');

// playlists
const playlists = require('./api/playlists');
const PlaylistsService = require('./services/app_services/PlaylistServices');
const PlaylistsValidator = require('./validator/playlists');

// playlist_songs
const playlistSongs = require('./api/playlist_songs');
const PlaylistSongsService = require('./services/app_services/PlaylistSongsServices');
const PlaylistSongsValidator = require('./validator/playlistsongs');

// collaborations
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/app_services/CollaborationService');
const CollaborationsValidator = require('./validator/collaborations');

// playlist activities
const playlist_activities = require('./api/playlisthistory');
const PlaylistHistoryService = require('./services/app_services/PlaylistHistoryService');

// Exports
const playlistExport = require('./api/exports');
const ProducerService = require('./services/rabbitmq/ProducerService');
const ExportsValidator = require('./validator/exports');

// Upload
const uploads = require('./api/uploads');
const StorageService = require('./services/storage/StorageService');
const UploadsValidator = require('./validator/uploads');

// Album Likes
const albumLikes = require('./api/album_likes');
const AlbumLikesService = require('./services/app_services/AlbumLikesServices');

// redis
const CacheService = require('./services/redis/CacheServices');

const init = async () => {
  const cacheService = new CacheService();
  const albumsService = new AlbumService();
  const songsService = new SongService();
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationsService();
  const collaborationsService = new CollaborationsService();
  const playlistsService = new PlaylistsService(collaborationsService);
  const playlistSongsService = new PlaylistSongsService();
  const playlistHistoryService = new PlaylistHistoryService();
  const albumLikesService = new AlbumLikesService(albumsService, cacheService);
  const storageService = new StorageService(
    path.resolve(__dirname, 'api/uploads/file/images'),
  );

  const server = Hapi.server({
    port: process.env.PORT,
    host: process.env.HOST,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  // registrasi plugin eksternal
  await server.register([
    {
      plugin: Jwt,
    },
    {
      plugin: Inert,
    },
  ]);

  // mendefinisikan strategy autentikasi jwt
  server.auth.strategy('openmusicapp_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: albums,
      options: {
        albumService: albumsService,
        songService: songsService,
        validator: AlbumsValidator,
      },
    },
    {
      plugin: songs,
      options: {
        service: songsService,
        validator: SongsValidator,
      },
    },
    {
      plugin: users,
      options: {
        service: usersService,
        validator: UsersValidator,
      },
    },
    {
      plugin: authentications,
      options: {
        authenticationsService,
        usersService,
        tokenManager: TokenManager,
        validator: AuthenticationsValidator,
      },
    },
    {
      plugin: playlists,
      options: {
        service: playlistsService,
        validator: PlaylistsValidator,
      },
    },
    {
      plugin: playlistSongs,
      options: {
        service: playlistSongsService,
        validator: PlaylistSongsValidator,
        playlistsService,
        songsService,
        playlistHistoryService,
      },
    },
    {
      plugin: collaborations,
      options: {
        collaborationsService,
        playlistService: playlistsService,
        userService: usersService,
        validator: CollaborationsValidator,
      },
    },
    {
      plugin: playlist_activities,
      options: {
        service: playlistHistoryService,
        playlistService: playlistsService,
      },
    },
    {
      plugin: playlistExport,
      options: {
        service: ProducerService,
        playlistService: playlistsService,
        validator: ExportsValidator,
      },
    },
    {
      plugin: uploads,
      options: {
        service: storageService,
        albumService: albumsService,
        validator: UploadsValidator,
      },
    },
    {
      plugin: albumLikes,
      options: {
        service: albumLikesService,
      },
    },
  ]);

  server.ext('onPreResponse', (request, h) => {
    const { response } = request;

    if (response instanceof Error) {
      if (response instanceof ClientError) {
        const newResponse = h.response({
          status: 'fail',
          message: response.message,
        });
        newResponse.code(response.statusCode);
        return newResponse;
      }

      if (!response.isServer) {
        return h.continue;
      }

      const newResponse = h.response({
        status: 'error',
        message: 'Terjadi kegagalan pada server kami',
      });
      console.log(response);
      newResponse.code(500);
      return newResponse;
    }

    return h.continue;
  });

  await server.start();
  console.log(`Server berjalan pada ${server.info.uri}`);
};

init();
