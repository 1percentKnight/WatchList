export interface allShow {
  show_id: string;
  show_name: string;
  release_date: string;
  end_date?: string;
  imdb_rating?: number;
  genres?: string[];
  languages?: string[];
  total_episodes?: number;
  poster_url?: string;
  duration?: string;
  rating?: string;
}

export interface userShow {
  userId: number,
  showId: string,
  totalEpisodes: number,
  watched: number
}