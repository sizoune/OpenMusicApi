const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../exceptions/InvariantError');
const NotFoundError = require('../exceptions/NotFoundError');
const { mapSongDBToListModel, mapSongDBToDetailModel } = require('../utils');

class SongServices {
  constructor() {
    this._pool = new Pool();
  }

  async addSong({
    title, year, genre, performer, duration, albumId,
  }) {
    const songID = `song-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING song_id',
      values: [songID, title, year, genre, performer, duration, albumId, createdAt, updatedAt],
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

  async getSongByAlbumId(albumID) {
    const query = {
      text: 'SELECT * FROM songs WHERE album_id = $1',
      values: [albumID],
    };
    const result = await this._pool.query(query);

    // if (!result.rows.length) {
    //   throw new NotFoundError('Lagu tidak ditemukan');
    // }

    return result.rows.map(mapSongDBToDetailModel);
  }

  async getSongByTitle(title) {
    const query = {
      text: 'SELECT song_id, title, performer FROM songs WHERE title ILIKE $1',
      values: [`%${title}%`],
    };
    const result = await this._pool.query(query);

    // if (!result.rows.length) {
    //   throw new NotFoundError('Lagu tidak ditemukan');
    // }

    return result.rows.map(mapSongDBToDetailModel);
  }

  async getSongByPerformer(performer) {
    const query = {
      text: 'SELECT song_id, title, performer FROM songs WHERE performer ILIKE $1',
      values: [`%${performer}%`],
    };
    const result = await this._pool.query(query);

    // if (!result.rows.length) {
    //   throw new NotFoundError('Lagu tidak ditemukan');
    // }

    return result.rows.map(mapSongDBToDetailModel);
  }

  async getSongByTitleAndPerformer(title, performer) {
    const query = {
      text: 'SELECT song_id, title, performer FROM songs WHERE title ILIKE $1 AND performer ILIKE $2',
      values: [`%${title}%`, `%${performer}%`],
    };
    const result = await this._pool.query(query);

    // if (!result.rows.length) {
    //   throw new NotFoundError('Lagu tidak ditemukan');
    // }

    return result.rows.map(mapSongDBToDetailModel);
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

  async getSongsByPlaylistId(id) {
    const result = await this._pool.query({
      text: `SELECT songs.id, songs.title, songs.performer FROM songs 
                LEFT JOIN playlistsongs ON playlistsongs.song_id = songs.id 
                WHERE playlistsongs.playlist_id = $1`,
      values: [id],
    });
    return result.rows;
  }
}

module.exports = SongServices;
