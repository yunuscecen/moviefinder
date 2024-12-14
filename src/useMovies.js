import { useState, useEffect } from 'react';

const KEY = '3a53a729';

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(
    function () {
      const controller = new AbortController();

      async function fetchMovies() {
        try {
          setIsLoading((isLoading) => true);
          setError('');
          const res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error('Something went wrong with fetching movies.');

          const data = await res.json();
          if (data.Response === 'False') throw new Error('Movie not found.');

          setMovies(data.Search);
        } catch (err) {
          if (err.name !== 'AbortError') setError(err.message);
        } finally {
          setIsLoading((isLoading) => false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError('');
        return;
      }

      fetchMovies();
      return function () {
        controller.abort();
        setError('');
      };
    },
    [query]
  );

  return { movies, isLoading, error };
}
