export interface allShow {
  show_id: string;
  show_name: string;
  release_date: string;
  end_date?: string;
  poster_url?: string;
  imdb_rating?: number;
  genres?: string[];
  total_episodes?: number;
}

export interface userShow {
  userId: number,
  showId: string,
  totalEpisodes: number,
  watched: number
}