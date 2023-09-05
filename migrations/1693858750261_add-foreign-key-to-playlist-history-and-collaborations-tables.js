exports.shorthands = undefined;

exports.up = (pgm) => {
  // memberikan constraint foreign key pada playlist_id di table collaborations
  // terhadap kolom id dari tabel playlists
  pgm.addConstraint('collaborations', 'fk_collaborations.playlist.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');

  // memberikan constraint foreign key pada user_id di table collaborations
  // terhadap kolom id dari tabel users
  pgm.addConstraint('collaborations', 'fk_collaborations.user.id', 'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE');

  // memberikan constraint foreign key pada playlist_id di table playlist_history
  // terhadap kolom id dari tabel playlists
  pgm.addConstraint('playlist_history', 'fk_playlist_history.playlist.id', 'FOREIGN KEY(playlist_id) REFERENCES playlists(id) ON DELETE CASCADE');
};

exports.down = (pgm) => {
  pgm.dropConstraint('collaborations', 'fk_collaborations.playlist.id');
  pgm.dropConstraint('collaborations', 'fk_collaborations.user.id');
  pgm.dropConstraint('playlist_history', 'fk_playlist_history.playlist.id');
};
