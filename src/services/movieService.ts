import axios from "axios";
import type { Movie } from "../types/movie";

const API_KEY = import.meta.env.VITE_TMDB_TOKEN;

axios.defaults.baseURL = "https://api.themoviedb.org/3/search";
axios.defaults.headers.common["Authorization"] = `Bearer ${API_KEY}`;

interface MovieHttpResponse {
  results: Movie[];
}

export const fetchMovies = async (title: string): Promise<Movie[]> => {
  const params = {
    query: title,
  };
  const { data } = await axios.get<MovieHttpResponse>("/movie", { params });
  return data.results;
};
