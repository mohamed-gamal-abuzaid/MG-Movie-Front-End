export interface Movie {
  id: number;
  title: string;
  description: string;
  posterPath?: string;
  backdropPath?: string;
  rating?: number;
  releaseDate?: string;
  genreIds?: number[];
  poster_path?: string;
  backdrop_path?: string;
  vote_average?: number;
  release_date?: string;
}

export interface TmdbResponse {
  page: number;
  results: Movie[];
  totalPages: number;
  totalResults: number;
}