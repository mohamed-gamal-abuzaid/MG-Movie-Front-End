import React, { useRef } from "react";
import type { Movie } from "../types/movie";
import { MovieCard } from "./MovieCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

export const MovieRow: React.FC<MovieRowProps> = ({ title, movies }) => {
  const rowRef = useRef<HTMLDivElement>(null);

  if (!movies || movies.length === 0) return null;

  const handleScroll = (direction: "left" | "right") => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = direction === "left" 
        ? scrollLeft - clientWidth * 0.75 
        : scrollLeft + clientWidth * 0.75;

      rowRef.current.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="space-y-4 py-4 group/row relative">
      <h2 className="text-lg md:text-xl font-black tracking-wider text-slate-900 dark:text-slate-100 border-l-4 border-indigo-500 pl-3 uppercase">
        {title}
      </h2>

      <div className="relative">
        <button
          onClick={() => handleScroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-30 h-24 w-10 flex items-center justify-center rounded-r-xl bg-white/50 dark:bg-slate-950/70 border-y border-r border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white opacity-0 group-hover/row:opacity-100 transition-all duration-300 hidden md:flex backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <div
          ref={rowRef}
          className="flex space-x-4 overflow-x-auto pb-4 scroll-smooth scrollbar-hide px-1 max-w-full"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        <button
          onClick={() => handleScroll("right")}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-30 h-24 w-10 flex items-center justify-center rounded-l-xl bg-white/50 dark:bg-slate-950/70 border-y border-l border-slate-300 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white opacity-0 group-hover/row:opacity-100 transition-all duration-300 hidden md:flex backdrop-blur-sm"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};