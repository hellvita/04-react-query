import { useState } from "react";
import { fetchMovies } from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import toast, { Toaster } from "react-hot-toast";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);

  const handleSearch = async (title: string) => {
    try {
      setMovies([]);
      setIsError(false);
      setIsLoading(true);
      const data = await fetchMovies(title);

      if (data.length === 0) {
        toast("No movies found for your request.");
        return;
      }

      setMovies(data);
    } catch (error) {
      setIsError(true);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMovie = (title: string) => {
    handleSearch(title);
  };

  const openModal = (movie: Movie) => setCurrentMovie(movie);

  const closeModal = () => setCurrentMovie(null);

  return (
    <>
      <SearchBar onSubmit={handleMovie} />
      <Toaster
        toastOptions={{
          className: "",
          style: {
            border: "1px solid #0a66c2",
            padding: "4px 8px",
            color: "#0a66c2",
            fontSize: "20px",
          },
        }}
      />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {movies.length > 0 && <MovieGrid onSelect={openModal} movies={movies} />}
      {currentMovie !== null && (
        <MovieModal movie={currentMovie} onClose={closeModal} />
      )}
    </>
  );
}
