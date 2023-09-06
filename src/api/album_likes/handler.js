const autoBind = require('auto-bind');

class AlbumLikesHandler {
  constructor(service) {
    this._service = service;

    autoBind(this);
  }

  async postLikeByIdHandler(request, h) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;
    await this._service.verifyUserLiked(id, credentialId);

    await this._service.addLikeToAlbum(id, credentialId);

    const response = h.response({
      status: 'success',
      message: 'Anda menyukai album ini',
    });
    response.code(201);
    return response;
  }

  async deleteLikeByIdHandler(request) {
    const { id } = request.params;
    const { id: credentialId } = request.auth.credentials;

    await this._service.deleteLike(id, credentialId);
    return {
      status: 'success',
      message: 'Anda batal menyukai album ini',
    };
  }

  async getLikesByIdHandler(request, h) {
    const { id } = request.params;
    const { likeCount, isCache } = await this._service.getAlbumLikes(id);
    const response = h.response({
      status: 'success',
      data: {
        likes: likeCount,
      },
    });
    if (isCache) {
      response.header('X-Data-Source', 'cache');
    }
    return response;
  }
}

module.exports = AlbumLikesHandler;
