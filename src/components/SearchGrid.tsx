import React from "react";
import type { Movie } from "../types/movie";
import { MovieCard } from "./MovieCard";

interface SearchGridProps {
  query: string;
  movies: Movie[];
}

export const SearchGrid: React.FC<SearchGridProps> = ({ query, movies }) => {
  return (
    <div className="space-y-6 py-6 animate-fade-in">
      {/* رأس صفحة البحث وعدد النتائج */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4 gap-2">
        <h2 className="text-xl md:text-2xl font-black text-slate-900 dark:text-slate-100">
          Search Results for: <span className="text-indigo-500 font-medium">"{query}"</span>
        </h2>
        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 w-max">
          Found {movies.length} {movies.length === 1 ? "movie" : "movies"}
        </span>
      </div>

      {/* لو مفيش نتائج */}
      {movies.length === 0 ? (
        <div className="text-center py-16 space-y-2">
          <p className="text-lg font-bold text-slate-400">No movies found matching your search.</p>
          <p className="text-xs text-slate-500">Try checking the spelling or typing another title.</p>
        </div>
      ) : (
        /* شبكة عرض الأفلام المتجاوبة مسطرة */
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 w-full">
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} isGrid={true} /> // 👈 ضفنا البروب هنا
          ))}
        </div>
      )}
    </div>
  );
};