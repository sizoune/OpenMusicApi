exports.shorthands = undefined;

exports.up = (pgm) => {
  // memberikan constraint foreign key pada album_id terhadap kolom id dari tabel albums
  pgm.addConstraint('songs', 'fk_songs.album.id', 'FOREIGN KEY(album_id) REFERENCES albums(album_id) ON DELETE CASCADE');

  // memberikan constraint foreign key pada owner terhadap kolom id dari tabel users
  pgm.addConstraint('playlists', 'fk_playlists.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');

  // memberikan constraint foreign key pada playlist_id terhadap kolom id dari tabel playlists
  pgm.addConstraint('playlists_songs', 'fk_playlists_songs.playlist.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');

  // memberikan constraint foreign key pada song_id terhadap kolom id dari tabel songs
  pgm.addConstraint('playlists_songs', 'fk_playlists_songs.songs.id', 'FOREIGN KEY(song_id) REFERENCES songs(song_id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('songs', 'fk_songs.album.id');
  pgm.dropConstraint('playlists', 'fk_playlists.owner_users.id');
  pgm.dropConstraint('playlists_songs', 'fk_playlists_songs.playlist.id');
  pgm.dropConstraint('playlists_songs', 'fk_playlists_songs.songs.id');
};
