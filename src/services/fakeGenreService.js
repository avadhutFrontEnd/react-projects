// Genres from API - matching exact database entries
export const genres = [
  { _id: "6777fb0eef2e9cc3d45406da", name: "Action" },
  { _id: "6777fb0eef2e9cc3d45406d1", name: "Comedy" },
  { _id: "6777fb0eef2e9cc3d45406e3", name: "Romance" },
  { _id: "6777fb0eef2e9cc3d45406ec", name: "Thriller" }
];

export function getGenres() {
  return genres.filter(g => g);
}
