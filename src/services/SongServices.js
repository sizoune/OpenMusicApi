/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const { mapAlbumDBToModel, mapSongDBToListModel, mapSongDBToDetailModel } = require('../utils');

class SongServices {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, genre, performer, duration, albumID,
  }) {
    const songID = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING song_id',
      values: [songID, title, year, genre, performer, duration, albumID, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].song_id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].song_id;
  }

  async getSongs() {
    const result = await this._pool.query('SELECT song_id, title, performer FROM songs');
    // console.log(result.rows);
    return result.rows.map(mapSongDBToListModel);
  }

  async getSongById(songID) {
    const query = {
      text: 'SELECT * FROM songs WHERE song_id = $1',
      values: [songID],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows.map(mapSongDBToDetailModel)[0];
  }

  async editSongById(songID, {
    title, year, genre, performer, duration, albumID,
  }) {
    const updatedAt = new Date().toISOString();
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, genre = $3, performer = $5, duration = $6, album_id = $7, updated_at = $8 WHERE song_id = $4 RETURNING song_id',
      values: [title, year, genre, songID, performer, duration, albumID, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui Lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(songID) {
    const query = {
      text: 'DELETE FROM songs WHERE song_id = $1 RETURNING song_id',
      values: [songID],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongServices;
