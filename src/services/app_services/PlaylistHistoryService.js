const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');

class PlaylistHistoryService {
  constructor() {
    this._pool = new Pool();
  }

  async addHistory(playlistId, songId, userId, action) {
    console.log(playlistId, songId, userId, action);
    const id = `history-${nanoid(16)}`;
    const time = new Date().toISOString();

    const query = {
      text: 'INSERT INTO playlist_history VALUES($1, $2, $3, $4, $5, $6) RETURNING id',
      values: [id, playlistId, songId, userId, action, time],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new InvariantError('Riwayat gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getHistory(playlistId) {
    const query = {
      text: `SELECT users.username, songs.title, playlist_history.action, playlist_history.time
      FROM playlist_history
      RIGHT JOIN users ON users.id = playlist_history.user_id
      RIGHT JOIN songs ON songs.song_id = playlist_history.song_id
      WHERE playlist_history.playlist_id = $1`,
      values: [playlistId],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    return result.rows;
  }
}

module.exports = PlaylistHistoryService;
