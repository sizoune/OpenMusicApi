const mapAlbumDBToModel = ({
  album_id,
  name,
  year,
  created_at,
  updated_at,
}) => ({
  id: album_id,
  name,
  year,
  createdAt: created_at,
  updatedAt: updated_at,
});

const mapSongDBToDetailModel = ({
  song_id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
  created_at,
  updated_at,
}) => ({
  id: song_id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
  createdAt: created_at,
  updatedAt: updated_at,
});

const mapSongDBToListModel = ({
  song_id,
  title,
  performer,
}) => ({
  id: song_id,
  title,
  performer,
});

module.exports = { mapAlbumDBToModel, mapSongDBToDetailModel, mapSongDBToListModel };
