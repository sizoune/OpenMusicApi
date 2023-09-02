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

module.exports = { mapAlbumDBToModel };
