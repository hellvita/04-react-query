import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { fetchMovies } from "../../services/movieService";
import SearchBar from "../SearchBar/SearchBar";
import ReactPaginate from "react-paginate";
import toast, { Toaster } from "react-hot-toast";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import css from "./App.module.css";

export default function App() {
  const [title, setTitle] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess, isPlaceholderData } = useQuery({
    queryKey: ["movies", title, currentPage],
    queryFn: () => fetchMovies(title, currentPage),
    enabled: title !== "",
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (isSuccess && !isPlaceholderData && data && data.results.length === 0)
      toast("No movies found for your request.");
  }, [isSuccess, isPlaceholderData, data, title]);

  const handleSearch = async (title: string) => {
    setTitle(title);
    setCurrentPage(1);
  };

  const handleMovie = (title: string) => {
    handleSearch(title);
  };

  const openModal = (movie: Movie) => setCurrentMovie(movie);

  const closeModal = () => setCurrentMovie(null);

  return (
    <div className={css.app}>
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
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setCurrentPage(selected + 1)}
          forcePage={data.page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {data && data.results.length > 0 && (
        <MovieGrid onSelect={openModal} movies={data.results} />
      )}
      {currentMovie !== null && (
        <MovieModal movie={currentMovie} onClose={closeModal} />
      )}
    </div>
  );
}
